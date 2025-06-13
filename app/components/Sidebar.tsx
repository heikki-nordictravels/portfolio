"use client"

/**
 * This component uses react-sidebar (with modifications)
 * Copyright (c) 2015 Paulus Schoutsen
 * Licensed under MIT License
 * https://github.com/balloob/react-sidebar
 */

import RippleLink from '../components/RippleLink';
import React from "react";
import dynamic from 'next/dynamic';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

// Dynamically import the Sidebar component with SSR disabled
const ReactSidebar = dynamic(() => import('react-sidebar'), {
  ssr: false,
});

// Define interfaces for props and state
interface SidebarProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

interface SidebarState {
  sidebarOpen: boolean;
}

class SidebarComponent extends React.Component<SidebarProps, SidebarState> {
  _touchStartY: number | null = null;

  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      sidebarOpen: props.isOpen || false
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentDidUpdate(prevProps: SidebarProps) {
    if (this.props.isOpen !== undefined && prevProps.isOpen !== this.props.isOpen) {
      this.setState({ sidebarOpen: this.props.isOpen });
      
      if (this.props.isOpen) {
        document.body.classList.add('sidebar-open');
        
        // Add touchmove handler to the overlay
        setTimeout(() => {
          const overlay = document.querySelector('.ReactSidebar__overlay');
          if (overlay) {
            overlay.addEventListener('touchmove', this.preventTouchMove, { passive: false });
          }
        }, 10);
      } else {
        document.body.classList.remove('sidebar-open');
        
        // Remove touchmove handler
        const overlay = document.querySelector('.ReactSidebar__overlay');
        if (overlay) {
          overlay.removeEventListener('touchmove', this.preventTouchMove);
        }
      }
    }
  }

  componentDidMount() {
    // Set initial body class
    if (this.state.sidebarOpen) {
      document.body.classList.add('sidebar-open');
    }
  }

  componentWillUnmount() {
    // Clean up body class
    document.body.classList.remove('sidebar-open');
    
    // Remove event listener
    const overlay = document.querySelector('.ReactSidebar__overlay');
    if (overlay) {
      overlay.removeEventListener('touchmove', this.preventTouchMove);
    }
  }

  onSetSidebarOpen(open: boolean) {
    this.setState({ sidebarOpen: open });
    
    // Update body class
    if (open) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    // Call the parent's onToggle if provided
    if (this.props.onToggle) {
      this.props.onToggle(open);
    }
  }

  preventTouchMove = (e: Event) => {
    e.preventDefault();
  };

  render() {
    return (
      <ReactSidebar
        sidebar={
        <div 
          className="inspectable pt-4 pb-4 w-full h-full bg-[var(--foreground)] flex flex-col"
          onTouchStart={(e) => {
            // Prevent default behavior for vertical swipes
            const touchY = e.touches[0].clientY;
            this._touchStartY = touchY;
          }}
          onTouchMove={(e) => {
            if (this._touchStartY) {
              const touchY = e.touches[0].clientY;
              const diff = touchY - this._touchStartY;
              
              // If swiping up or down more than a small threshold, prevent default
              if (Math.abs(diff) > 10) {
                e.preventDefault();
              }
            }
          }}
        >
          <nav className="inspectable mt-16">
            <ul className="inspectable sidebar-navbar flex flex-col px-1">
              <li className="inspectable sidebar-navitem sidebar-navitem-border">
                <RippleLink href="/" className="z-20 absolute inspectable sidebar-navitem text-lg block p-3 hover:bg-[var(--navitem-bg-hover)]">
                  HOME
                </RippleLink>
              </li>
              <li className="inspectable sidebar-navitem">
                <RippleLink href="/projects" className="inspectable text-lg block p-3 hover:bg-[var(--navitem-bg-hover)] rounded">
                  PROJECTS
                </RippleLink>
              </li>
              <li className="inspectable sidebar-navitem">
                <RippleLink href="/contact" className="text-lg block p-3 hover:bg-[var(--navitem-bg-hover)] rounded sidebar-navitem-border">
                    CONTACT
                </RippleLink>
              </li>
            </ul>
          </nav>
          <div className="mt-auto mb-8">
            <ul className="flex justify-center space-x-4">
              <li>
                <a href="https://github.com/heikki-nordictravels" target="_blank" rel="noopener noreferrer">
                  <FaGithub size={30} className="someicon" />
                </a>
              </li>
              <li>
                <a href='https://instagram.com' target='_blank' rel="noopener noreferrer">
                  <FaInstagram size={30} className="someicon" />
                </a>
              </li>
              <li>
                <a href='https://linkedin.com' target='_blank' rel="noopener noreferrer">
                  <FaLinkedin size={30} className="someicon" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        }
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        styles={{
          sidebar: { 
            background: "var(--foreground)",
            zIndex: "1000",
            width: "250px", 
            position: "fixed",
            overscrollBehavior: "none"
          },
          overlay: {
            zIndex: "999",
            overscrollBehavior: "none",
            touchAction: "none"
          },
          content: {
            position: "relative",
            overflow: "visible"
          }
        }}
        pullRight={true}
        shadow={true}
        overlayClassName="sidebar-overlay"
      >
        <div>
          {this.props.children}
        </div>
      </ReactSidebar>
    );
  }
}



export default SidebarComponent;