-- Adventure Mist Stay Inn Rwanda seed data.
-- Run this in Supabase SQL editor after supabase/schema.sql.

begin;

delete from public.reviews;
delete from public.payments;
delete from public.bookings;
delete from public.room_images;
delete from public.rooms;
delete from public.hotel_images;
delete from public.hotels;

with inserted_hotel as (
  insert into public.hotels (
    name,
    city,
    country,
    address,
    description,
    contact_email,
    contact_phone,
    rating,
    price_from,
    status
  )
  values (
    'Adventure Mist Stay Inn Rwanda',
    'Kigali',
    'Rwanda',
    'Kigali, Rwanda',
    'Adventure Mist Stay Inn Rwanda is a calm Kigali stay for travelers who want comfort, reliable service, and easy access to Rwanda city experiences and outdoor adventures.',
    'adventuremiststayinnrwanda@gmail.com',
    '+250 700 000 000',
    4.8,
    65,
    'active'
  )
  returning id
),
inserted_rooms as (
  insert into public.rooms (
    hotel_id,
    name,
    room_number,
    description,
    price_per_night,
    capacity,
    bed_type,
    room_size,
    status
  )
  select
    inserted_hotel.id,
    room.name,
    room.room_number,
    room.description,
    room.price_per_night,
    room.capacity,
    room.bed_type,
    room.room_size,
    'available'
  from inserted_hotel
  cross join (
    values
      (
        'Standard Queen Room',
        '101',
        'A clean and comfortable queen room for solo travelers or couples, with breakfast and reliable WiFi included.',
        65::numeric,
        2,
        'Queen bed',
        '28 sqm'
      ),
      (
        'Deluxe King Room',
        '102',
        'A spacious king room with a calmer premium feel, designed for longer stays and restful evenings in Kigali.',
        90::numeric,
        2,
        'King bed',
        '36 sqm'
      ),
      (
        'Family Suite',
        '201',
        'A practical suite for families or small groups with extra sleeping space, TV, breakfast, and room to settle in.',
        125::numeric,
        4,
        'King bed + twin beds',
        '52 sqm'
      ),
      (
        'Adventure View Suite',
        '202',
        'A larger suite with lounge seating and scenic views, ideal for guests who want extra comfort after a day out.',
        150::numeric,
        3,
        'King bed + sofa',
        '58 sqm'
      )
  ) as room(name, room_number, description, price_per_night, capacity, bed_type, room_size)
  returning id, name
)
insert into public.hotel_images (hotel_id, image_url, alt_text, sort_order)
select
  inserted_hotel.id,
  image.image_url,
  image.alt_text,
  image.sort_order
from inserted_hotel
cross join (
  values
    (
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80',
      'Rwanda landscape near Adventure Mist Stay Inn Rwanda',
      1
    ),
    (
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
      'Adventure Mist Stay Inn Rwanda hotel exterior',
      2
    ),
    (
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'Adventure Mist Stay Inn Rwanda guest room',
      3
    )
) as image(image_url, alt_text, sort_order);

insert into public.room_images (room_id, image_url, alt_text, sort_order)
select
  rooms.id,
  case rooms.name
    when 'Standard Queen Room' then 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80'
    when 'Deluxe King Room' then 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    when 'Family Suite' then 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80'
    else 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
  end,
  rooms.name,
  1
from public.rooms
join public.hotels on hotels.id = rooms.hotel_id
where hotels.name = 'Adventure Mist Stay Inn Rwanda';

commit;
