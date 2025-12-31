import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600',
    title: 'Football Championship 2024',
    category: 'Football',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600',
    title: 'Cricket Tournament Finals',
    category: 'Cricket',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600',
    title: 'Volleyball League',
    category: 'Volleyball',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600',
    title: 'Badminton Championship',
    category: 'Badminton',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600',
    title: 'Basketball Tournament',
    category: 'Basketball',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600',
    title: 'Award Ceremony',
    category: 'Events',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600',
    title: 'Football Training Session',
    category: 'Football',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600',
    title: 'Cricket Practice',
    category: 'Cricket',
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600',
    title: 'Team Celebration',
    category: 'Events',
  },
];

const categories = ['All', 'Football', 'Cricket', 'Volleyball', 'Badminton', 'Basketball', 'Events'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

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
              Photo <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Relive the moments of glory, teamwork, and celebration
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-30 backdrop-blur-lg bg-background/90">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-1">
                      {image.category}
                    </p>
                    <h3 className="font-heading text-xl text-foreground">{image.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url.replace('w=600', 'w=1200')}
                alt={selectedImage.title}
                className="w-full rounded-xl shadow-card"
              />
              <div className="mt-4 text-center">
                <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-1">
                  {selectedImage.category}
                </p>
                <h3 className="font-heading text-2xl text-foreground">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;