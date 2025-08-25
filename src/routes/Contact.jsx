import ContactForm from "../components/ContactForm.jsx";

export default function Contact() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="text-white/70 mt-2">Call <a className="underline" href="tel:+27794950855">079 495 0855</a> or use the form and we’ll reach out from <span className="font-mono">info@ghosthome.co.za</span>.</p>
      <div className="mt-6">
        <ContactForm />
      </div>
      <p className="text-xs text-white/50 mt-6">By submitting this form you agree to responsible CCTV use. POPIA signage and privacy zones available.</p>
    </div>
  );
}