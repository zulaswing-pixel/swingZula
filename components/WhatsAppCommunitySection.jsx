export default function WhatsAppCommunitySection() {
  return (
    <section className="w-full bg-gradient-to-br from-sky-50 to-blue-100 py-16 text-center">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-700 mb-6">
          Join Our Swing Zula WhatsApp Community
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-700 opacity-90 max-w-3xl mx-auto mb-10 leading-relaxed">
          Be the first to know about new swing designs, exclusive launches, special discounts, 
          customization tips, and home decor inspiration — all delivered directly to your WhatsApp!
        </p>

        {/* CTA Button */}
        <a
          href="https://chat.whatsapp.com/JbZfGKxzXWB4oiQnf2AFXa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 bg-green-600 hover:bg-green-700 
                     text-white px-10 py-5 rounded-2xl text-xl font-semibold 
                     transition-all duration-300 shadow-xl hover:shadow-2xl 
                     transform hover:-translate-y-1 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="currentColor"
            className="drop-shadow-md"
          >
            <path d="M16 0C7.164 0 0 7.164 0 16c0 2.828.742 5.59 2.148 8.046L0 32l8.27-2.106A15.91 15.91 0 0 0 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.333c-2.56 0-5.07-.67-7.27-1.944l-.52-.302-4.906 1.25 1.31-4.785-.338-.56A13.25 13.25 0 0 1 2.667 16c0-7.343 5.99-13.333 13.333-13.333 7.344 0 13.333 5.99 13.333 13.333 0 7.344-5.99 13.333-13.333 13.333zm7.457-9.457c-.41-.205-2.42-1.195-2.795-1.333-.375-.14-.648-.205-.92.205-.273.41-1.055 1.332-1.295 1.606-.24.273-.477.307-.888.102-.41-.205-1.732-.64-3.3-2.04-1.222-1.09-2.046-2.436-2.287-2.845-.239-.41-.026-.631.18-.836.184-.183.41-.477.614-.716.205-.239.273-.41.41-.682.137-.273.068-.512-.034-.717-.103-.205-.92-2.219-1.26-3.034-.332-.803-.672-.694-.92-.707l-.786-.014c-.273 0-.717.102-1.092.512-.375.41-1.442 1.41-1.442 3.436 0 2.025 1.478 3.985 1.683 4.26.205.273 2.91 4.445 7.038 6.213.984.424 1.75.677 2.348.867.986.312 1.884.268 2.594.162.792-.117 2.42-.988 2.762-1.94.341-.953.341-1.771.239-1.939-.103-.171-.375-.272-.786-.478z" />
          </svg>
          Join Community Now
        </a>

        {/* Optional subtle decoration */}
        <div className="mt-12 flex justify-center gap-4 opacity-30">
          <div className="w-16 h-1 bg-blue-400 rounded-full"></div>
          <div className="w-8 h-1 bg-sky-500 rounded-full"></div>
          <div className="w-16 h-1 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}