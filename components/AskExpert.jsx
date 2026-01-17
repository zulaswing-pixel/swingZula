import { useState } from "react";
import { MailQuestionMark } from "lucide-react";

export default function AskExpert() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const STORE_NAME =process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "swing-9926.myshopify.com";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    store: STORE_NAME, 
  });
const [errors, setErrors] = useState({});

const onlyLetters = (val) => val.replace(/[^a-zA-Z\s]/g, "");
const onlyNumbers = (val) => val.replace(/\D/g, "");

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


 const handleChange = (e) => {
  const { name, value } = e.target;

  let updatedValue = value;

  if (name === "name") updatedValue = onlyLetters(value);
  if (name === "phone") updatedValue = onlyNumbers(value).slice(0, 10);

  setForm({ ...form, [name]: updatedValue });
};


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const res = await fetch("https://adminrocket.megascale.co.in/api/ask-expert", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(form), 
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       alert("Your message has been sent!");
  //       setIsOpen(false);
  //       setForm({
  //         name: "",
  //         email: "",
  //         phone: "",
  //         message: "",
  //         store: STORE_NAME,
  //       });
  //     } else {
  //       alert("Failed to send message.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Something went wrong.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!form.name.trim()) newErrors.name = "Name is required";
  if (!form.email || !isValidEmail(form.email))
    newErrors.email = "Enter a valid email";
  if (!form.phone || form.phone.length !== 10)
    newErrors.phone = "Enter a valid 10 digit phone number";
  if (!form.message.trim())
    newErrors.message = "Message is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  setLoading(true);

  try {
    const res = await fetch(
      "https://adminrocket.megascale.co.in/api/ask-expert",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Your message has been sent!");
      setIsOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        store: STORE_NAME,
      });
    } else {
      alert("Failed to send message.");
    }
  } catch (error) {
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-black hover:underline ml-2 flex items-center gap-2 cursor-pointer"
      >
        <MailQuestionMark className="w-5 h-5 " />
        <span>Ask an Expert</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#000000b0] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Ask an Expert</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ✅ Hidden field */}
              <input type="hidden" name="store" value={form.store} />

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2 h-24"
              />
              {errors.message && (
  <p className="text-red-500 text-sm">{errors.message}</p>
)}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
