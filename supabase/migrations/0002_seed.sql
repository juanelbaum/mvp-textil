-- TextilConnect MVP - seed data (mirrors src/lib/mocks/*).
-- Uses fixed UUIDs so the frontend (RoleProvider / constants) can reference
-- them deterministically across dev and CI environments.

begin;

-- Manufacturers -----------------------------------------------------------

insert into users (id, role, email, name, phone, location, description, created_at) values
  ('11111111-1111-1111-1111-000000000001', 'manufacturer', 'carlos@modatex.com', 'Carlos Méndez',   '+54 11 4567-8901', 'Buenos Aires, Argentina', 'Fabricante de ropa casual y deportiva con 15 años de experiencia.', '2024-01-15'),
  ('11111111-1111-1111-1111-000000000002', 'manufacturer', 'laura@urbanwear.com', 'Laura Fernández', '+54 11 5678-1234', 'Córdoba, Argentina',      'Diseñadora y fabricante de moda urbana sostenible.',              '2024-03-20');

insert into manufacturers (user_id, company_name, industry, orders_count) values
  ('11111111-1111-1111-1111-000000000001', 'ModaTex SA',    'Ropa casual',  24),
  ('11111111-1111-1111-1111-000000000002', 'Urban Wear Co', 'Moda urbana',  12);

-- Workshops ---------------------------------------------------------------

insert into users (id, role, email, name, phone, location, description, created_at) values
  ('22222222-2222-2222-2222-000000000001', 'workshop', 'roberto@tallertextil.com',  'Roberto García', '+54 11 3456-7890', 'Buenos Aires, Argentina', 'Taller especializado en confección de alta calidad con maquinaria industrial moderna. Más de 20 años de experiencia en el rubro textil.', '2023-06-10'),
  ('22222222-2222-2222-2222-000000000002', 'workshop', 'maria@costurasml.com',      'María López',    '+54 351 234-5678', 'Córdoba, Argentina',      'Taller familiar con expertise en ropa deportiva y activewear. Equipos de sublimación de última generación.',                              '2023-09-05'),
  ('22222222-2222-2222-2222-000000000003', 'workshop', 'ana@hilosdeoro.com',        'Ana Martínez',   '+54 11 8765-4321', 'Rosario, Argentina',      'Especialistas en alta costura y vestimenta de eventos. Bordado artesanal de primera calidad.',                                            '2023-04-15'),
  ('22222222-2222-2222-2222-000000000004', 'workshop', 'pedro@industrialtex.com',   'Pedro Sánchez',  '+54 11 2345-6789', 'Buenos Aires, Argentina', 'Producción industrial a gran escala. Capacidad para manejar grandes volúmenes con tiempos de entrega rápidos.',                            '2022-11-20'),
  ('22222222-2222-2222-2222-000000000005', 'workshop', 'lucia@artesanatextil.com',  'Lucía Torres',   '+54 261 987-6543', 'Mendoza, Argentina',      'Taller artesanal con enfoque en sustentabilidad y materiales orgánicos. Certificación de comercio justo.',                                 '2024-01-08');

insert into workshops (user_id, workshop_name, services, specialties, capacity, rating, reviews_count, completed_orders, min_order_quantity, lead_time_days, images) values
  ('22222222-2222-2222-2222-000000000001', 'Taller Textil García', array['Corte','Confección','Terminación','Bordado'],           array['Camisas','Pantalones','Ropa formal'],            'high',   4.8, 45, 156, 50,  14, array[]::text[]),
  ('22222222-2222-2222-2222-000000000002', 'Costuras M&L',         array['Confección','Estampado','Sublimación'],                 array['Ropa deportiva','Activewear','Remeras'],         'medium', 4.5, 32,  89, 30,  10, array[]::text[]),
  ('22222222-2222-2222-2222-000000000003', 'Hilos de Oro',         array['Alta costura','Confección','Bordado a mano','Diseño personalizado'], array['Vestidos de fiesta','Trajes','Alta costura'], 'low',    4.9, 28,  67, 10,  21, array[]::text[]),
  ('22222222-2222-2222-2222-000000000004', 'Industrial Tex',       array['Corte industrial','Confección','Empaque','Control de calidad'],       array['Producción masiva','Uniformes','Ropa de trabajo'], 'high', 4.3, 67, 234, 200,  7, array[]::text[]),
  ('22222222-2222-2222-2222-000000000005', 'Artesana Textil',      array['Confección artesanal','Teñido natural','Tejido'],       array['Moda sustentable','Ropa orgánica','Tejidos artesanales'], 'low', 4.7, 19,  42, 20,  18, array[]::text[]);

-- Orders ------------------------------------------------------------------

insert into orders (id, title, description, manufacturer_id, workshop_id, status, garment_type, quantity, material, deadline, budget, specifications, created_at, updated_at) values
  ('33333333-3333-3333-3333-000000000001',
   'Producción de camisetas básicas',
   'Lote de camisetas de algodón en 5 colores, tallas S a XXL. Incluir etiquetas personalizadas.',
   '11111111-1111-1111-1111-000000000001',
   '22222222-2222-2222-2222-000000000001',
   'in_production', 'Camisetas', 500, 'Algodón 100%', '2026-05-15', 15000,
   array['5 colores','Tallas S-XXL','Etiqueta personalizada','Empaque individual'],
   '2026-03-01', '2026-03-20'),

  ('33333333-3333-3333-3333-000000000002',
   'Pantalones cargo temporada invierno',
   'Pantalones cargo en tela gabardina para colección de invierno.',
   '11111111-1111-1111-1111-000000000001',
   '22222222-2222-2222-2222-000000000004',
   'accepted', 'Pantalones', 300, 'Gabardina', '2026-06-01', 22500,
   array['3 colores','Tallas 38-46','6 bolsillos','Cierre YKK'],
   '2026-03-10', '2026-03-15'),

  ('33333333-3333-3333-3333-000000000003',
   'Vestidos de fiesta colección verano',
   'Vestidos largos en tela de seda con bordados artesanales para evento especial.',
   '11111111-1111-1111-1111-000000000002',
   '22222222-2222-2222-2222-000000000003',
   'quality_check', 'Vestidos', 50, 'Seda', '2026-04-20', 45000,
   array['Bordado a mano','3 modelos','Tallas XS-L','Forro interior'],
   '2026-02-15', '2026-04-01'),

  ('33333333-3333-3333-3333-000000000004',
   'Remeras deportivas sublimadas',
   'Remeras deportivas con sublimación full print para equipo de running.',
   '11111111-1111-1111-1111-000000000001',
   null,
   'pending', 'Remeras deportivas', 200, 'Poliéster Dry-fit', '2026-05-30', 8000,
   array['Sublimación full print','Tallas S-XL','Corte regular','Etiqueta termoimpresa'],
   '2026-04-01', '2026-04-01'),

  ('33333333-3333-3333-3333-000000000005',
   'Uniformes corporativos',
   'Camisas y pantalones para uniforme de empresa de servicios.',
   '11111111-1111-1111-1111-000000000002',
   '22222222-2222-2222-2222-000000000004',
   'completed', 'Uniformes', 150, 'Poliéster-algodón', '2026-03-15', 18000,
   array['Logo bordado','2 piezas por uniforme','Tallas S-XXL','Color azul marino'],
   '2026-01-20', '2026-03-10'),

  ('33333333-3333-3333-3333-000000000006',
   'Camperas de abrigo',
   'Camperas puffer con relleno sintético para colección otoño-invierno.',
   '11111111-1111-1111-1111-000000000001',
   '22222222-2222-2222-2222-000000000001',
   'cancelled', 'Camperas', 100, 'Nylon con relleno sintético', '2026-04-30', 35000,
   array['Relleno 200g','Capucha desmontable','Cierre frontal','3 colores'],
   '2026-02-01', '2026-02-20');

-- Timeline events ---------------------------------------------------------

insert into order_timeline_events (id, order_id, status, description, timestamp) values
  ('44444444-4444-4444-4444-000000000001', '33333333-3333-3333-3333-000000000001', 'pending',       'Orden creada y publicada',                      '2026-03-01T10:00:00Z'),
  ('44444444-4444-4444-4444-000000000002', '33333333-3333-3333-3333-000000000001', 'accepted',      'Taller Textil García aceptó la orden',          '2026-03-05T14:30:00Z'),
  ('44444444-4444-4444-4444-000000000003', '33333333-3333-3333-3333-000000000001', 'in_production', 'Producción iniciada - corte de telas',          '2026-03-10T09:00:00Z'),
  ('44444444-4444-4444-4444-000000000004', '33333333-3333-3333-3333-000000000003', 'pending',       'Orden creada y publicada',                      '2026-02-15T11:00:00Z'),
  ('44444444-4444-4444-4444-000000000005', '33333333-3333-3333-3333-000000000003', 'accepted',      'Hilos de Oro aceptó la orden',                  '2026-02-18T16:00:00Z'),
  ('44444444-4444-4444-4444-000000000006', '33333333-3333-3333-3333-000000000003', 'in_production', 'Inicio de confección y bordado',                '2026-02-25T08:00:00Z'),
  ('44444444-4444-4444-4444-000000000007', '33333333-3333-3333-3333-000000000003', 'quality_check', 'Prendas en revisión de calidad final',          '2026-04-01T10:00:00Z'),
  ('44444444-4444-4444-4444-000000000008', '33333333-3333-3333-3333-000000000005', 'pending',       'Orden creada',                                  '2026-01-20T09:00:00Z'),
  ('44444444-4444-4444-4444-000000000009', '33333333-3333-3333-3333-000000000005', 'accepted',      'Industrial Tex aceptó la orden',                '2026-01-22T11:00:00Z'),
  ('44444444-4444-4444-4444-000000000010', '33333333-3333-3333-3333-000000000005', 'in_production', 'Producción en curso',                           '2026-01-28T08:00:00Z'),
  ('44444444-4444-4444-4444-000000000011', '33333333-3333-3333-3333-000000000005', 'quality_check', 'Control de calidad aprobado',                   '2026-03-05T14:00:00Z'),
  ('44444444-4444-4444-4444-000000000012', '33333333-3333-3333-3333-000000000005', 'completed',     'Orden completada y entregada',                  '2026-03-10T16:00:00Z');

-- Workshop reviews --------------------------------------------------------

insert into workshop_reviews (id, workshop_id, manufacturer_id, order_id, rating, comment, created_at) values
  ('55555555-5555-5555-5555-000000000001', '22222222-2222-2222-2222-000000000001', '11111111-1111-1111-1111-000000000001', '33333333-3333-3333-3333-000000000005', 5, 'Excelente calidad de confección. Cumplieron con los plazos y la comunicación fue muy buena.', '2026-03-12'),
  ('55555555-5555-5555-5555-000000000002', '22222222-2222-2222-2222-000000000001', '11111111-1111-1111-1111-000000000002', '33333333-3333-3333-3333-000000000002', 4, 'Buen trabajo en general. Algunos detalles menores que se corrigieron rápidamente.',         '2026-02-20'),
  ('55555555-5555-5555-5555-000000000003', '22222222-2222-2222-2222-000000000003', '11111111-1111-1111-1111-000000000002', '33333333-3333-3333-3333-000000000003', 5, 'Bordado artesanal increíble. La atención al detalle es impresionante.',                     '2026-01-15'),
  ('55555555-5555-5555-5555-000000000004', '22222222-2222-2222-2222-000000000004', '11111111-1111-1111-1111-000000000001', '33333333-3333-3333-3333-000000000005', 4, 'Gran capacidad de producción. Entregaron todo a tiempo.',                                    '2026-03-11');

commit;
