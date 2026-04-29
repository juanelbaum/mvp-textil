'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WorkshopContactButton = () => {
  const handleContact = () => {
    window.alert('Contacto demo: en producción aquí iría mensajería o email.');
  };

  return (
    <Button className="gap-2" onClick={handleContact}>
      <MessageSquare className="h-4 w-4" aria-hidden />
      Contactar Taller
    </Button>
  );
};
