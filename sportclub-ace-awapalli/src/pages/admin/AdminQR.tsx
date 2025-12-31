import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { mockQrCodeUrl } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Upload, QrCode, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminQR = () => {
  const initialQr = typeof window !== 'undefined' ? (localStorage.getItem('qrCodeUrl') || mockQrCodeUrl) : mockQrCodeUrl;
  const [qrCodeUrl, setQrCodeUrl] = useState(initialQr);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) {
      toast({
        title: 'No Image Selected',
        description: 'Please select a QR code image to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setQrCodeUrl(previewUrl);
    try {
      localStorage.setItem('qrCodeUrl', previewUrl as string);
    } catch (err) {
      console.error('Could not save QR to localStorage', err);
    }
    setPreviewUrl(null);
    setIsUploading(false);

    toast({
      title: 'QR Code Updated',
      description: 'The payment QR code has been updated successfully.',
    });
  };

  const handleCancel = () => {
    setPreviewUrl(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-4xl text-foreground mb-2">QR Code Management</h1>
          <p className="text-muted-foreground">Upload and manage the payment QR code for paid registrations.</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-heading text-xl text-foreground">Current QR Code</h2>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <img
                src={qrCodeUrl}
                alt="Payment QR Code"
                className="w-64 h-64 mx-auto object-contain"
              />
              <p className="text-muted-foreground text-sm mt-4">
                This QR code is displayed to users for paid registrations.
              </p>
            </div>
          </motion.div>

          {/* Upload New QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-heading text-xl text-foreground">Upload New QR Code</h2>
            </div>

            {previewUrl ? (
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-4">Preview:</p>
                  <img
                    src={previewUrl}
                    alt="New QR Code Preview"
                    className="w-64 h-64 mx-auto object-contain"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCancel}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Update QR Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="qr-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-foreground font-semibold mb-1">Click to upload</p>
                <p className="text-muted-foreground text-sm">PNG, JPG or SVG (max 5MB)</p>
                <input
                  id="qr-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-card rounded-xl border border-border p-6"
        >
          <h3 className="font-heading text-xl text-foreground mb-4">Instructions</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-semibold">1.</span>
              Generate a UPI QR code from your payment app (Google Pay, PhonePe, Paytm, etc.)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-semibold">2.</span>
              Make sure the QR code is clear and easily scannable
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-semibold">3.</span>
              Upload the QR code image using the form above
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-semibold">4.</span>
              The new QR code will be displayed to users during paid registrations
            </li>
          </ul>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminQR;