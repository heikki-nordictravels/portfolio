"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FaInstagram, FaLinkedin, FaGithub, FaBars} from 'react-icons/fa';
import Sidebar from './Sidebar';

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    
    return (
        <div className='inspectable headers relative z-20'>
            
            {/*----------------------------MOBILE VIEW----------------------------*/}   

            <div className='inspectable block lg:hidden'>
                <header className='inspectable row-start-1 w-full flex items-right pr-8 header-mobile relative'>
                    <Link href="/" className="inspectable z-900 text-title text-3xl">
                    HEIKKI MÄNTY
                    </Link>
                    
                    <div 
                      className="inspectable relative mt-7 ml-auto cursor-pointer z-1001" 
                      onClick={toggleSidebar}
                    >
                        {/* <FaCircle className='inspectable circle absolute top-0 left-0 z-0' /> */}
                        <FaBars className='inspectable hamburger z-10 relative' />
                    </div>
                    <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />
                    
                </header>
            </div>

            {/*---------------------------DESKTOP VIEW---------------------------*/}

            <div className='inspectable relative hidden lg:block'>
                
            <header className="inspectable row-start-1 w-full flex items-center justify-between pl-10 px-4 header-desktop">
                <Link href="/" className="inspectable text-title">
                    HEIKKI MÄNTY
                </Link>                <nav className="inspectable">
                    <ul className="inspectable flex navbar">
                        <li className="inspectable">
                            <Link href="/" className="inspectable navitem navitem-border">
                                HOME
                            </Link>
                        </li>
                        <li className="inspectable">
                            <Link href="/projects" className="inspectable navitem">
                                PROJECTS
                            </Link>
                        </li>
                        <li className="inspectable">
                            <Link href="/contact" className="inspectable navitem navitem-border">
                                CONTACT
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="inspectable some">
                    <ul className="ml-8 flex some-icons-list">
                        <li>
                            <a href="https://github.com/heikki-nordictravels" target="_blank" rel="noopener noreferrer">
                                <FaGithub size={40} className="someicon" />
                            </a>
                        </li>
                        <li>
                            <a href='https://instagram.com' target='_blank' rel="noopener noreferrer">
                                <FaInstagram size={40} className="someicon" />
                            </a>
                        </li>
                        <li>
                            <a href='https://linkedin.com' target='_blank' rel="noopener noreferrer">
                                <FaLinkedin size={40} className="someicon" />
                            </a>
                        </li>
                    </ul>

                </div>
            </header>
            </div>
        </div>
        
    );
};

export default Header;