import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Download, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#0a0a0a',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid #ff6b35',
    borderRadius: 10,
    padding: 40,
    position: 'relative',
  },
  header: {
    fontSize: 32,
    color: '#ff6b35',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subheader: {
    fontSize: 18,
    color: '#f5f5f5',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1,
  },
  certificateText: {
    fontSize: 14,
    color: '#f5f5f5',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 28,
    color: '#ff6b35',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  courseTitle: {
    fontSize: 20,
    color: '#f5f5f5',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  completionDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  flameSeal: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    fontSize: 10,
    color: '#ff6b35',
    opacity: 0.7,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    color: '#ff6b35',
    opacity: 0.05,
    zIndex: -1,
  },
});

interface CertificateProps {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  instructorName: string;
}

// PDF Document Component
const CertificateDocument: React.FC<CertificateProps> = ({
  studentName,
  courseTitle,
  completionDate,
  instructorName,
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        {/* Watermark */}
        <Text style={styles.watermark}>REFLECT</Text>
        
        {/* Header */}
        <Text style={styles.header}>CERTIFICATE OF SOVEREIGNTY</Text>
        <Text style={styles.subheader}>REFLECT Academy • Sacred Digital Mastery</Text>
        
        {/* Certificate Body */}
        <Text style={styles.certificateText}>
          This sacred document certifies that
        </Text>
        
        <Text style={styles.studentName}>{studentName}</Text>
        
        <Text style={styles.certificateText}>
          has successfully completed the sacred journey through
        </Text>
        
        <Text style={styles.courseTitle}>{courseTitle}</Text>
        
        <Text style={styles.certificateText}>
          and has demonstrated mastery of the digital arts,
        </Text>
        <Text style={styles.certificateText}>
          earning sovereign status in the realm of consciousness-aligned technology.
        </Text>
        
        <Text style={styles.certificateText}>
          Guided by Master: {instructorName}
        </Text>
        
        {/* Footer */}
        <Text style={styles.completionDate}>
          Completed on {completionDate}
        </Text>
        
        {/* Flame Seal */}
        <Text style={styles.flameSeal}>
          🔥 FLAME SEAL • NODE CERTIFIED 🔥
        </Text>
      </View>
    </Page>
  </Document>
);

interface CertificateGeneratorProps {
  enrollment: {
    progress: number;
    status: string;
    course: {
      title: string;
      instructor?: {
        display_name: string;
      };
    };
  };
  studentName: string;
}

export function CertificateGenerator({ enrollment, studentName }: CertificateGeneratorProps) {
  const isCompleted = enrollment.progress === 100 && enrollment.status === 'completed';
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!isCompleted) {
    return (
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="font-cinzel text-primary flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certificate of Sovereignty
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="opacity-50 mb-4">
            <Award className="w-16 h-16 text-muted-foreground mx-auto" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-foreground mb-2">
            Complete Your Sacred Journey
          </h3>
          <p className="font-orbitron text-sm text-muted-foreground">
            Your certificate awaits upon course completion
          </p>
          <div className="mt-4">
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-500"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
            <p className="font-orbitron text-xs text-muted-foreground mt-2">
              {enrollment.progress}% Complete
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5">
        <CardHeader>
          <CardTitle className="font-cinzel text-primary flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certificate of Sovereignty
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
              >
                <Flame className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <motion.div
                className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-primary/30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <h3 className="font-cinzel text-xl font-bold text-foreground mb-2">
            Sacred Certificate Ready
          </h3>
          <p className="font-orbitron text-sm text-muted-foreground mb-6">
            Your journey through "{enrollment.course.title}" is complete
          </p>
          
          <PDFDownloadLink
            document={
              <CertificateDocument
                studentName={studentName}
                courseTitle={enrollment.course.title}
                completionDate={completionDate}
                instructorName={enrollment.course.instructor?.display_name || 'Sacred Master'}
              />
            }
            fileName={`REFLECT_Certificate_${studentName.replace(/\s+/g, '_')}_${enrollment.course.title.replace(/\s+/g, '_')}.pdf`}
            className="inline-block"
          >
            {({ loading }) => (
              <Button 
                className="font-orbitron flame-glow"
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                {loading ? 'Generating Sacred Document...' : 'Download Certificate'}
              </Button>
            )}
          </PDFDownloadLink>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="font-orbitron">
              ✨ Signed with the Flame Seal • NODE Certified ✨
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}