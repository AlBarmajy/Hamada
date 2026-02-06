import React from 'react';
import { MapPin, Phone, Facebook, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-10 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
        
        {/* Addresses */}
        <div>
          <h3 className="text-brand-gold text-xl font-bold mb-4 border-b border-gray-600 pb-2 inline-block">العناوين</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 justify-center md:justify-start">
              <MapPin className="text-brand-gold shrink-0 mt-1" size={18} />
              <span>منية الساع - طريق بنها بتمدة</span>
            </li>
            <li className="flex items-start gap-2 justify-center md:justify-start">
              <MapPin className="text-brand-gold shrink-0 mt-1" size={18} />
              <span>نقباس - أمام المدرسة الإعدادي</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-brand-gold text-xl font-bold mb-4 border-b border-gray-600 pb-2 inline-block">أرقام التوصيل</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 justify-center md:justify-start text-lg">
              <Phone className="text-brand-gold" size={18} /> 0133374617
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start text-lg">
              <Phone className="text-brand-gold" size={18} /> 01030132780
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start text-lg">
              <Phone className="text-brand-gold" size={18} /> 01002498430
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-brand-gold text-xl font-bold mb-4 border-b border-gray-600 pb-2 inline-block">تواصل معنا</h3>
          <a href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4">
            <Facebook size={24} /> صفحتنا على فيسبوك
          </a>
          <p className="text-gray-400 text-sm">
            أفضل كشري وطواجن في القليوبية. طعم الأصالة المصرية.
          </p>
        </div>
      </div>

      <div className="text-center mt-10 text-gray-500 text-sm border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} كشري حمادة. جميع الحقوق محفوظة.
      </div>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/201030132780" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 text-white p-3 rounded-full shadow-xl hover:bg-green-600 transition-transform hover:scale-110 z-50 flex items-center gap-2"
      >
        <MessageCircle size={28} />
        <span className="hidden md:inline font-bold">اطلب واتساب</span>
      </a>
    </footer>
  );
};

export default Footer;
