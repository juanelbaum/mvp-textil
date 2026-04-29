-- Retarget FKs from users(id) to the specialization tables
-- (manufacturers.user_id / workshops.user_id). This lets PostgREST
-- embed manufacturer/workshop data directly from orders and
-- workshop_reviews, and also enforces that a manufacturer_id column
-- actually references a user with the manufacturer role (idem workshops).

begin;

-- orders.manufacturer_id -> manufacturers(user_id)
alter table orders drop constraint if exists orders_manufacturer_id_fkey;
alter table orders
  add constraint orders_manufacturer_id_fkey
  foreign key (manufacturer_id) references manufacturers(user_id) on delete restrict;

-- orders.workshop_id -> workshops(user_id)
alter table orders drop constraint if exists orders_workshop_id_fkey;
alter table orders
  add constraint orders_workshop_id_fkey
  foreign key (workshop_id) references workshops(user_id) on delete set null;

-- workshop_reviews.workshop_id -> workshops(user_id)
alter table workshop_reviews drop constraint if exists workshop_reviews_workshop_id_fkey;
alter table workshop_reviews
  add constraint workshop_reviews_workshop_id_fkey
  foreign key (workshop_id) references workshops(user_id) on delete cascade;

-- workshop_reviews.manufacturer_id -> manufacturers(user_id)
alter table workshop_reviews drop constraint if exists workshop_reviews_manufacturer_id_fkey;
alter table workshop_reviews
  add constraint workshop_reviews_manufacturer_id_fkey
  foreign key (manufacturer_id) references manufacturers(user_id) on delete cascade;

commit;
