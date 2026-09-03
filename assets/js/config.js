/* ==========================================================================
   VISIONS BARBERSHOP — site configuration
   --------------------------------------------------------------------------
   EDIT THIS FILE, NOT THE HTML.
   Every "Book" button on the site points at BOOKING_URL below.
   Paste the Booksy link between the quotes and the whole site updates.
   ========================================================================== */

window.VISIONS = {

  /* >>> PASTE THE BOOKSY LINK HERE <<<
     Until it's filled in, Book buttons fall back to the Squire page. */
  BOOKING_URL: "https://booksy.com/en-us/1496951_visions-barbershop_barber-shop_10014_illinois",

  /* Live booking page already in use by the shop (fallback) */
  SQUIRE_URL: "https://getsquire.com/discover/barbershop/visions-barbershop-romeoville-1",

  INSTAGRAM_URL: "https://www.instagram.com/visions.barbershop/",
  GOOGLE_URL:    "https://www.google.com/search?q=visions+barbershop+romeoville",
  REVIEWS_URL:   "https://www.google.com/search?q=visions+barbershop+romeoville#lrd=0x0:0x0,1",

  PHONE_DISPLAY: "(815) 552-9093",
  PHONE_TEL:     "+18155529093",

  ADDRESS:       "37 W Normantown Rd, Romeoville, IL 60446",
  DIRECTIONS_URL:"https://www.google.com/maps/dir/?api=1&destination=Visions+Barbershop%2C+37+W+Normantown+Rd%2C+Romeoville%2C+IL+60446",

  /* Opening hours in 24h decimal, America/Chicago. null = closed. */
  HOURS: [
    { day:"Sunday",    open:null, close:null },
    { day:"Monday",    open:10,   close:19 },
    { day:"Tuesday",   open:10,   close:19 },
    { day:"Wednesday", open:10,   close:19 },
    { day:"Thursday",  open:10,   close:19 },
    { day:"Friday",    open:9,    close:20 },
    { day:"Saturday",  open:8,    close:17 }
  ],

  TIMEZONE: "America/Chicago"
};

/* Resolved link every Book button uses */
window.VISIONS.BOOK = window.VISIONS.BOOKING_URL || window.VISIONS.SQUIRE_URL;
