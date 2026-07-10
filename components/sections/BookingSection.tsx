import BookingForm from "@/components/BookingForm";

export default function BookingSection() {
  return (
    <section id="reservar" className="bg-ivory py-24 md:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center flex">Reserva tu consultoría</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-title">Agenda tu consultoría privada</h2>
          <p className="mt-5 text-navy/60">
            Complete el formulario y uno de nuestros tasadores certificados
            confirmará su cita a la brevedad.
          </p>
        </div>

        <div className="mt-14">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
