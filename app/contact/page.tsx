import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import ParallaxLines from "../components/ParallaxLines";

import { FaInstagram, FaLinkedin, FaRegEnvelope, FaPhone, FaFilePdf} from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="contacts font-[family-name:var(--font-geist-sans)] min-h-screen relative">
      <ParallaxLines opacity={0.4} strokeWidth={3} zIndex={5} />
      <Header/>      
      <main className="relative z-10 flex flex-col gap-[32px] row-start-2 sm:items-start">
        <h1 className="relative z-10 inspectable text-center w-full pt-12 pb-6">Interested?</h1>
        <p className="inspectable z-10 relative text-center w-full max-w-4xl mx-auto px-4 text-lg">
          Reach out through any of these channels
        </p>
        <div className="inspectable contact-methods z-10 w-full">
          <ul className="inspectable flex flex-col lg:flex-row justify-center items-center gap-6">                
            <li className="inspectable">
              <div className="contact-card p-4 w-60">
                <FaInstagram className="inspectable contact-icon mx-auto text-4xl m-4"/>
                <h3 className="inspectable text-center">INSTAGRAM</h3>
                <Link 
                  href="https://instagram.com" 
                  className="text-center inspectable text-lg block p-3 rounded text-[var(--navitem-text)] hover:text-[var(--navitem-text-hover)] transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <u>Follow me</u>
                </Link>
              </div>
            </li>
            <li className="inspectable">
              <div className="inspectable contact-card bg-[var(--navitem-bg-hover)] p-4 w-60">
                <FaRegEnvelope className="inspectable contact-icon mx-auto text-4xl m-4"/>
                <h3 className="inspectable text-center">EMAIL</h3>
                <Link 
                  href="mailto:heikkim03@gmail.com" 
                  className="text-center w-full inspectable text-lg block p-3 rounded text-[var(--navitem-text)] hover:text-[var(--navitem-text-hover)] transition-colors" 
                  rel="noopener noreferrer"
                >
                  <u>heikkim03@gmail.com</u>
                </Link>
              </div>
            </li>
            <li>
              <div className="contact-card bg-[var(--navitem-bg-hover)] p-4 w-60">
                <FaPhone className="contact-icon mx-auto text-4xl m-4"/>
                <h3 className="text-center">PHONE</h3>
                <Link 
                  href="tel:+358401685768" 
                  className="text-center w-full inspectable text-lg block p-3 rounded text-[var(--navitem-text)] hover:text-[var(--navitem-text-hover)] transition-colors" 
                  rel="noopener noreferrer"
                >
                  <u>(+358) 401685768</u>
                </Link>
              </div>
            </li>
            <li>
              <div className="contact-card bg-[var(--navitem-bg-hover)] p-4 w-60">
                <FaLinkedin className="contact-icon mx-auto text-4xl m-4"/>
                <h3 className="text-center">LINKEDIN</h3>
                <Link 
                  href="https://linkedin.com" 
                  className="text-center w-full inspectable text-lg block p-3 rounded text-[var(--navitem-text)] hover:text-[var(--navitem-text-hover)] transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <u>Check me out</u>
                </Link>
              </div>
            </li>
          </ul>
          <div className="flex justify-center mt-10 mb-10 w-full">
            <div className="contact-card bg-[var(--navitem-bg-hover)] p-4 w-100">
              <FaFilePdf className="contact-icon mx-auto text-4xl m-4"/>
              <Link 
                href="/uploads/cv.pdf" 
                className="text-center w-full inspectable text-lg block p-3 rounded text-[var(--navitem-text)] hover:text-[var(--navitem-text-hover)] transition-colors" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <u>Check out my CV</u>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
