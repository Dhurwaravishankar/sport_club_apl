import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const RECIPIENT_EMAIL = 'dhurwaravishankar24@navgurukul.org';
  const MAP_ADDRESS = 'Mini Stadium, HQHF+VG4, Awapalli, Chhattisgarh 494447';
  const MAP_QUERY = encodeURIComponent(MAP_ADDRESS);
  const EMBED_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d980.6318202334037!2d80.77264304354081!3d18.579567199246643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a33d5d4e90193ed%3A0xa701e0ecd0ffdf9!2sMini%20Stadium!5e1!3m2!1sen!2sin!4v1767094820207!5m2!1sen!2sin';
  const DIR_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;
  // Open Google Maps directions. Try to use user's current location as origin if available.
  const openDirections = () => {
    const base = 'https://www.google.com/maps/dir/?api=1';
    const destination = encodeURIComponent(MAP_ADDRESS);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
          const url = `${base}&origin=${encodeURIComponent(origin)}&destination=${destination}&travelmode=driving`;
          window.open(url, '_blank');
        },
        () => {
          // permission denied or error -> fallback to generic directions link
          window.open(DIR_URL, '_blank');
        },
        { timeout: 5000 }
      );
    } else {
      window.open(DIR_URL, '_blank');
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    const subject = encodeURIComponent(formData.subject || 'Contact from website');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || ''}\n\n${formData.message}`
    );
    const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    setSubmitted(true);
    toast({ title: 'Email Client Opened', description: 'Your email client should open to send the message.' });
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
    setSubmitted(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl text-foreground mb-8">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Sport Club Awapalli<br />
                      Main Road, Awapalli <br />
                      District - Bijapur
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground">+91 7647947048</p>
                    <p className="text-muted-foreground">+91 98765 43211</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">info@sportclubawapalli.com</p>
                    <p className="text-muted-foreground">support@sportclubawapalli.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">Monday - Sunday: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Sunday: 24 X 7</p>
                  </div>
                </div>
              </div>

              {/* Map Integration */}
              <div className="mt-8 bg-gradient-card rounded-xl border border-border overflow-hidden">
                <div className="w-full h-64 md:h-80 lg:h-96">
                  <iframe
                    title="Sport Club Awapalli location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d980.6318202334037!2d80.77264304354081!3d18.579567199246643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a33d5d4e90193ed%3A0xa701e0ecd0ffdf9!2sMini%20Stadium!5e1!3m2!1sen!2sin!4v1767094820207!5m2!1sen!2sin"
                    className="w-full h-full border-0"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{MAP_ADDRESS}</p>
                    <p className="text-sm text-muted-foreground">Main Road, Awapalli, Bijapur</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={openDirections}
                      className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:brightness-95"
                    >
                      Get Directions
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-md border border-border text-sm"
                    >
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {submitted ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
                    <h3 className="font-heading text-2xl text-foreground mb-4">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button variant="outline" onClick={resetForm}>
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-gradient-card rounded-xl p-8 border border-border">
                  <h2 className="font-heading text-3xl text-foreground mb-8">Send a Message</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this about?"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message..."
                        className="mt-2 min-h-[150px]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;