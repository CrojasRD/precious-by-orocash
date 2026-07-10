-- ============================================================
-- PRECIOUS BY OROCASH — Esquema de base de datos (Supabase / Postgres)
-- ============================================================
-- Ejecutar en el SQL Editor de Supabase, en orden.

-- Extensión para generar UUIDs
create extension if not exists "pgcrypto";

-- Extensión para búsqueda por similitud de texto (usada en índices GIN más abajo)
create extension if not exists pg_trgm;

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
create type appointment_reason as enum (
  'valuar',
  'inversion',
  'liquidar',
  'asesoria_patrimonial',
  'otro'
);

create type appointment_status as enum (
  'pendiente',
  'confirmada',
  'atendida',
  'no_asistio',
  'cancelada'
);

create type transaction_type as enum (
  'compra',
  'venta'
);

-- Sistema de 5 roles (ver políticas RLS más abajo para el detalle
-- exacto de qué puede hacer cada uno):
--   admin      → acceso total: citas, transacciones, valuaciones,
--                documentos, usuarios y configuración.
--   editor     → solo contenido/imágenes en /admin/settings. Nunca ve
--                datos de clientes, citas, transacciones ni valuaciones.
--   asesor     → solo sus propias citas asignadas (assigned_advisor_id).
--                Puede ver la ficha del cliente, describir el oro/gema
--                traído, generar el informe de valoración y dejar notas
--                privadas. Nunca ve datos financieros (transactions) ni
--                edita contenido del sitio.
--   recepcion  → agenda/calendario de todas las citas, confirma citas,
--                registra clientes nuevos y lleva el registro de
--                asistencia. Nunca edita contenido ni genera valoraciones.
--   viewer     → cliente con acceso al portal. Ve únicamente su propia
--                cita (por coincidencia de email), descarga su informe
--                de valoración y sube documentos previos a la cita.
create type user_role as enum (
  'admin',
  'editor',
  'asesor',
  'recepcion',
  'viewer'
);

-- ------------------------------------------------------------
-- TABLA: users (perfiles de acceso, vinculados a auth.users)
-- ------------------------------------------------------------
-- Se crea antes que "appointments" porque esta última referencia
-- users(id) mediante assigned_advisor_id.
create table users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        user_role not null default 'viewer',
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- TABLA: appointments
-- ------------------------------------------------------------
create table appointments (
  id                      uuid primary key default gen_random_uuid(),
  full_name               text not null,
  identification_number  text not null,
  phone                   text not null,
  email                   text not null,
  appointment_reason      appointment_reason not null,
  appointment_date        date not null,
  appointment_time        time not null,
  additional_comment      text,
  appointment_status      appointment_status not null default 'pendiente',
  -- Asesor/tasador asignado a la cita. Solo ese asesor (y admin) puede
  -- ver y gestionar el detalle de la cita (ver políticas RLS).
  assigned_advisor_id     uuid references users(id) on delete set null,
  -- Descripción del oro/gemas que el cliente trae a la cita, capturada
  -- por el asesor o recepción (no visible para el rol "editor").
  item_description        text,
  -- Notas privadas del asesor, nunca expuestas al cliente (viewer).
  advisor_notes           text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index idx_appointments_date on appointments (appointment_date);
create index idx_appointments_status on appointments (appointment_status);
create index idx_appointments_identification on appointments (identification_number);
create index idx_appointments_reason on appointments (appointment_reason);
create index idx_appointments_advisor on appointments (assigned_advisor_id);
create index idx_appointments_full_name_trgm on appointments using gin (full_name gin_trgm_ops);

-- ------------------------------------------------------------
-- TABLA: transactions (1:1 con appointments)
-- ------------------------------------------------------------
create table transactions (
  id                      uuid primary key default gen_random_uuid(),
  appointment_id          uuid not null references appointments(id) on delete cascade,
  transaction_completed   boolean not null default false,
  transaction_type        transaction_type,
  transaction_value       numeric(12, 2) check (transaction_value is null or transaction_value >= 0),
  internal_notes          text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint uq_transactions_appointment unique (appointment_id),
  constraint chk_transaction_type_requires_completed
    check (transaction_completed = true or transaction_type is null)
);

create index idx_transactions_type on transactions (transaction_type);
create index idx_transactions_completed on transactions (transaction_completed);

-- ------------------------------------------------------------
-- TABLA: valuation_reports (1:1 con appointments)
-- ------------------------------------------------------------
-- El asesor asignado genera el informe de valoración. El cliente
-- (rol "viewer") puede descargarlo desde el portal una vez publicado.
create table valuation_reports (
  id                uuid primary key default gen_random_uuid(),
  appointment_id    uuid not null references appointments(id) on delete cascade,
  report_url        text not null,
  summary           text,
  estimated_value   numeric(12, 2) check (estimated_value is null or estimated_value >= 0),
  created_by        uuid references users(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint uq_valuation_reports_appointment unique (appointment_id)
);

create index idx_valuation_reports_appointment on valuation_reports (appointment_id);

-- ------------------------------------------------------------
-- TABLA: client_documents (N:1 con appointments)
-- ------------------------------------------------------------
-- Documentos que el cliente sube antes de su cita (ej. fotos de las
-- piezas, facturas de compra previas) desde el portal (rol "viewer").
create table client_documents (
  id                uuid primary key default gen_random_uuid(),
  appointment_id    uuid not null references appointments(id) on delete cascade,
  file_url          text not null,
  file_name         text not null,
  uploaded_by_email text not null,
  created_at        timestamptz not null default now()
);

create index idx_client_documents_appointment on client_documents (appointment_id);

-- ------------------------------------------------------------
-- TABLA: site_settings (fila única con la marca del sitio)
-- ------------------------------------------------------------
-- Guarda lo que el admin puede editar manualmente desde el panel:
-- el texto del logotipo (nombre + subtítulo), un logo en imagen
-- opcional, y el banner del hero de la landing.
create table site_settings (
  id                boolean primary key default true,
  brand_name        text not null default 'PRECIOUS',
  brand_subtitle    text not null default 'by Orocash',
  hero_banner_url   text,
  logo_image_url    text,
  updated_at        timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

insert into site_settings (id) values (true)
  on conflict (id) do nothing;

-- ------------------------------------------------------------
-- STORAGE: bucket público para banner y logo
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

create policy "public_can_read_branding_assets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'branding');

-- Solo admin y editor administran el contenido/branding del sitio.
create policy "staff_can_upload_branding_assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'branding'
    and exists (
      select 1 from users
      where users.id = auth.uid() and users.role in ('admin', 'editor')
    )
  );

create policy "staff_can_update_branding_assets"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'branding'
    and exists (
      select 1 from users
      where users.id = auth.uid() and users.role in ('admin', 'editor')
    )
  );

create policy "staff_can_delete_branding_assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'branding'
    and exists (
      select 1 from users
      where users.id = auth.uid() and users.role in ('admin', 'editor')
    )
  );

-- ------------------------------------------------------------
-- STORAGE: bucket privado para informes de valoración y documentos
-- ------------------------------------------------------------
-- Convención de rutas: "{appointment_id}/{archivo}". Así las políticas
-- pueden correlacionar cada objeto con su cita sin columnas extra.
insert into storage.buckets (id, name, public)
values ('client-files', 'client-files', false)
on conflict (id) do nothing;

-- admin, asesor asignado y recepción pueden leer todo lo relacionado
-- a una cita que les corresponde; el cliente (viewer) solo lee lo de
-- su propia cita (coincidencia de email).
create policy "staff_and_owner_can_read_client_files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'client-files'
    and (
      exists (
        select 1 from users
        where users.id = auth.uid() and users.role in ('admin', 'recepcion')
      )
      or exists (
        select 1 from appointments a
        join users u on u.id = auth.uid()
        where a.id::text = (storage.foldername(name))[1]
          and u.role = 'asesor'
          and a.assigned_advisor_id = u.id
      )
      or exists (
        select 1 from appointments a
        join users u on u.id = auth.uid()
        where a.id::text = (storage.foldername(name))[1]
          and u.role = 'viewer'
          and lower(a.email) = lower(u.email)
      )
    )
  );

-- admin y el asesor asignado suben informes de valoración; el cliente
-- (viewer) sube sus propios documentos previos a la cita.
create policy "staff_and_owner_can_upload_client_files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'client-files'
    and (
      exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
      or exists (
        select 1 from appointments a
        join users u on u.id = auth.uid()
        where a.id::text = (storage.foldername(name))[1]
          and u.role = 'asesor'
          and a.assigned_advisor_id = u.id
      )
      or exists (
        select 1 from appointments a
        join users u on u.id = auth.uid()
        where a.id::text = (storage.foldername(name))[1]
          and u.role = 'viewer'
          and lower(a.email) = lower(u.email)
      )
    )
  );

create policy "admin_can_delete_client_files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'client-files'
    and exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
  );

-- ------------------------------------------------------------
-- TRIGGERS: updated_at automático
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_appointments_updated_at
  before update on appointments
  for each row execute function set_updated_at();

create trigger trg_transactions_updated_at
  before update on transactions
  for each row execute function set_updated_at();

create trigger trg_valuation_reports_updated_at
  before update on valuation_reports
  for each row execute function set_updated_at();

create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

-- Crea automáticamente una fila en "users" cuando se registra un
-- usuario en Supabase Auth. El rol por defecto es "viewer" (el menos
-- privilegiado); los roles de staff (admin/editor/asesor/recepcion) se
-- asignan explícitamente desde /admin/users (ver Server Action de
-- creación de usuarios) usando el cliente service-role.
create or replace function handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'viewer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table appointments enable row level security;
alter table transactions enable row level security;
alter table users enable row level security;
alter table site_settings enable row level security;
alter table valuation_reports enable row level security;
alter table client_documents enable row level security;

-- appointments: cualquiera (incluido anónimo desde el sitio público)
-- puede INSERTAR una cita. La lectura/edición depende del rol:
--   admin      → todas las citas.
--   recepcion  → todas las citas (calendario, confirmación, registro
--                de clientes y asistencia).
--   asesor     → únicamente las citas que tiene asignadas.
--   viewer     → únicamente su propia cita (coincidencia de email).
--   editor     → sin acceso (queda fuera a propósito).
create policy "public_can_insert_appointments"
  on appointments for insert
  to anon, authenticated
  with check (true);

create policy "staff_can_select_appointments"
  on appointments for select
  to authenticated
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role in ('admin', 'recepcion')
    )
    or exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'asesor'
        and users.id = appointments.assigned_advisor_id
    )
    or exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'viewer'
        and lower(users.email) = lower(appointments.email)
    )
  );

create policy "staff_can_update_appointments"
  on appointments for update
  to authenticated
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role in ('admin', 'recepcion')
    )
    or exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'asesor'
        and users.id = appointments.assigned_advisor_id
    )
  )
  with check (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role in ('admin', 'recepcion')
    )
    or exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'asesor'
        and users.id = appointments.assigned_advisor_id
    )
  );

create policy "admin_can_delete_appointments"
  on appointments for delete
  to authenticated
  using (exists (select 1 from users where users.id = auth.uid() and users.role = 'admin'));

-- transactions: datos financieros. Solo admin (ni asesor, ni recepcion,
-- ni editor, ni viewer tienen acceso — así lo pide el negocio).
create policy "admin_can_select_transactions"
  on transactions for select
  to authenticated
  using (exists (select 1 from users where users.id = auth.uid() and users.role = 'admin'));

create policy "admin_can_insert_transactions"
  on transactions for insert
  to authenticated
  with check (exists (select 1 from users where users.id = auth.uid() and users.role = 'admin'));

create policy "admin_can_update_transactions"
  on transactions for update
  to authenticated
  using (exists (select 1 from users where users.id = auth.uid() and users.role = 'admin'))
  with check (exists (select 1 from users where users.id = auth.uid() and users.role = 'admin'));

-- valuation_reports: admin y el asesor asignado a la cita generan y
-- editan el informe; el cliente (viewer) solo lee el de su propia cita.
create policy "staff_can_select_valuation_reports"
  on valuation_reports for select
  to authenticated
  using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
    or exists (
      select 1 from appointments a
      join users u on u.id = auth.uid()
      where a.id = valuation_reports.appointment_id
        and u.role = 'asesor'
        and a.assigned_advisor_id = u.id
    )
    or exists (
      select 1 from appointments a
      join users u on u.id = auth.uid()
      where a.id = valuation_reports.appointment_id
        and u.role = 'viewer'
        and lower(a.email) = lower(u.email)
    )
  );

create policy "advisor_can_insert_valuation_reports"
  on valuation_reports for insert
  to authenticated
  with check (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
    or exists (
      select 1 from appointments a
      join users u on u.id = auth.uid()
      where a.id = valuation_reports.appointment_id
        and u.role = 'asesor'
        and a.assigned_advisor_id = u.id
    )
  );

create policy "advisor_can_update_valuation_reports"
  on valuation_reports for update
  to authenticated
  using (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
    or exists (
      select 1 from appointments a
      join users u on u.id = auth.uid()
      where a.id = valuation_reports.appointment_id
        and u.role = 'asesor'
        and a.assigned_advisor_id = u.id
    )
  )
  with check (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
    or exists (
      select 1 from appointments a
      join users u on u.id = auth.uid()
      where a.id = valuation_reports.appointment_id
        and u.role = 'asesor'
        and a.assigned_advisor_id = u.id
    )
  );

-- client_documents: el cliente (viewer) sube y ve los suyos; admin,
-- el asesor asignado y recepcion pueden verlos.
create policy "involved_staff_and_owner_can_select_client_documents"
  on client_documents for select
  to authenticated
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role in ('admin', 'recepcion')
    )
    or exists (
      select 1 from appointments a
      join users u on u.id = auth.uid()
      where a.id = client_documents.appointment_id
        and u.role = 'asesor'
        and a.assigned_advisor_id = u.id
    )
    or exists (
      select 1 from appointments a
      join users u on u.id = auth.uid()
      where a.id = client_documents.appointment_id
        and u.role = 'viewer'
        and lower(a.email) = lower(u.email)
    )
  );

create policy "owner_can_insert_client_documents"
  on client_documents for insert
  to authenticated
  with check (
    exists (select 1 from users where users.id = auth.uid() and users.role = 'admin')
    or exists (
      select 1 from appointments a
      join users u on u.id = auth.uid()
      where a.id = client_documents.appointment_id
        and u.role = 'viewer'
        and lower(a.email) = lower(u.email)
    )
  );

create policy "admin_can_delete_client_documents"
  on client_documents for delete
  to authenticated
  using (exists (select 1 from users where users.id = auth.uid() and users.role = 'admin'));

-- users: cada usuario puede ver su propio perfil; los admin ven,
-- crean, editan y eliminan cualquier perfil (gestión de usuarios).
create policy "user_can_select_self"
  on users for select
  to authenticated
  using (auth.uid() = id or exists (
    select 1 from users u where u.id = auth.uid() and u.role = 'admin'
  ));

create policy "admin_can_insert_users"
  on users for insert
  to authenticated
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

create policy "admin_can_update_users"
  on users for update
  to authenticated
  using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

create policy "admin_can_delete_users"
  on users for delete
  to authenticated
  using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

-- site_settings: cualquiera puede leer (la landing pública necesita
-- el logotipo y el banner), solo el staff autenticado puede editar.
create policy "public_can_read_site_settings"
  on site_settings for select
  to anon, authenticated
  using (true);

create policy "staff_can_update_site_settings"
  on site_settings for update
  to authenticated
  using (exists (
    select 1 from users
    where users.id = auth.uid() and users.role in ('admin', 'editor')
  ))
  with check (exists (
    select 1 from users
    where users.id = auth.uid() and users.role in ('admin', 'editor')
  ));

-- ------------------------------------------------------------
-- VISTA: métricas agregadas para el dashboard
-- ------------------------------------------------------------
create or replace view appointment_metrics as
select
  count(*) as total_appointments,
  count(*) filter (where appointment_status = 'pendiente') as pending_count,
  count(*) filter (where appointment_status = 'confirmada') as confirmed_count,
  count(*) filter (where appointment_status = 'atendida') as attended_count,
  count(*) filter (where appointment_status = 'no_asistio') as no_show_count,
  count(*) filter (where appointment_status = 'cancelada') as cancelled_count,
  (select count(*) from transactions where transaction_completed = true) as transactions_count,
  coalesce((select sum(transaction_value) from transactions where transaction_type = 'compra'), 0) as total_purchases,
  coalesce((select sum(transaction_value) from transactions where transaction_type = 'venta'), 0) as total_sales,
  coalesce((select sum(transaction_value) from transactions where transaction_completed = true), 0) as total_value
from appointments;

-- Nota: el control de acceso a esta vista se hereda de las políticas
-- RLS de "appointments" y "transactions" (security_invoker en PG15+).
alter view appointment_metrics set (security_invoker = true);

-- ------------------------------------------------------------
-- SEED de ejemplo (opcional, borrar en producción)
-- ------------------------------------------------------------
-- insert into appointments (full_name, identification_number, phone, email, appointment_reason, appointment_date, appointment_time)
-- values ('María Fernanda Torres', '1712345678', '+593987654321', 'maria@example.com', 'valuar', current_date + 2, '10:00');
