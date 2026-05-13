-- ============================================================
-- ConeRURAL - Schema completo para Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  farm_name    text not null default 'Mi Chacra',
  avatar_url   text,
  timezone     text not null default 'America/Argentina/Buenos_Aires',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- SPECIES
-- ============================================================
create table if not exists species (
  id         uuid primary key default uuid_generate_v4(),
  owner_id   uuid not null references profiles(id) on delete cascade,
  name       text not null,
  code       text not null,
  icon       text,
  notes      text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  unique(owner_id, code)
);

-- ============================================================
-- SECTORS
-- ============================================================
create table if not exists sectors (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  name        text not null,
  type        text not null default 'corral',
  description text,
  capacity    integer,
  notes       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- ANIMALS
-- ============================================================
create table if not exists animals (
  id                 uuid primary key default uuid_generate_v4(),
  owner_id           uuid not null references profiles(id) on delete cascade,
  species_id         uuid not null references species(id),
  sector_id          uuid references sectors(id) on delete set null,
  animal_code        text not null,
  name               text,
  sex                text default 'unknown',
  birth_date         date,
  acquisition_date   date,
  acquisition_cost   numeric(10,2),
  acquisition_source text,
  breed              text,
  color              text,
  tag_number         text,
  status             text not null default 'active',
  status_date        date,
  status_notes       text,
  weight_kg          numeric(7,2),
  notes              text,
  photo_url          text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique(owner_id, animal_code)
);

create table if not exists animal_code_sequences (
  owner_id    uuid not null references profiles(id) on delete cascade,
  species_id  uuid not null references species(id) on delete cascade,
  last_number integer not null default 0,
  primary key (owner_id, species_id)
);

-- ============================================================
-- ANIMAL EVENTS
-- ============================================================
create table if not exists animal_events (
  id             uuid primary key default uuid_generate_v4(),
  owner_id       uuid not null references profiles(id) on delete cascade,
  animal_id      uuid not null references animals(id) on delete cascade,
  event_type     text not null,
  event_date     date not null default current_date,
  weight_kg      numeric(7,2),
  feed_type      text,
  feed_amount_kg numeric(6,2),
  feed_cost      numeric(8,2),
  diagnosis      text,
  treatment      text,
  medication     text,
  dose           text,
  vet_name       text,
  next_due_date  date,
  value_numeric  numeric(10,2),
  value_text     text,
  notes          text,
  photo_url      text,
  created_by     uuid references profiles(id),
  created_at     timestamptz not null default now()
);

-- ============================================================
-- CROPS
-- ============================================================
create table if not exists crops (
  id                    uuid primary key default uuid_generate_v4(),
  owner_id              uuid not null references profiles(id) on delete cascade,
  sector_id             uuid references sectors(id) on delete set null,
  name                  text not null,
  plant_type            text not null,
  variety               text,
  seeding_date          date,
  expected_harvest_date date,
  actual_harvest_date   date,
  area_m2               numeric(8,2),
  row_count             integer,
  plant_count           integer,
  status                text not null default 'active',
  notes                 text,
  photo_url             text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================
-- CROP EVENTS
-- ============================================================
create table if not exists crop_events (
  id           uuid primary key default uuid_generate_v4(),
  owner_id     uuid not null references profiles(id) on delete cascade,
  crop_id      uuid not null references crops(id) on delete cascade,
  event_type   text not null,
  event_date   date not null default current_date,
  water_liters numeric(8,2),
  duration_min integer,
  product_name text,
  amount_kg    numeric(7,2),
  amount_l     numeric(7,2),
  cost         numeric(8,2),
  yield_kg     numeric(8,2),
  yield_units  integer,
  sale_price   numeric(8,2),
  notes        text,
  photo_url    text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- SUPPLIES
-- ============================================================
create table if not exists supplies (
  id               uuid primary key default uuid_generate_v4(),
  owner_id         uuid not null references profiles(id) on delete cascade,
  name             text not null,
  category         text not null,
  unit             text not null default 'kg',
  current_stock    numeric(10,2) not null default 0,
  min_stock_alert  numeric(10,2),
  unit_cost        numeric(8,2),
  supplier         text,
  notes            text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- EXPENSES
-- ============================================================
create table if not exists expenses (
  id               uuid primary key default uuid_generate_v4(),
  owner_id         uuid not null references profiles(id) on delete cascade,
  amount           numeric(10,2) not null,
  currency         text not null default 'ARS',
  category         text not null,
  description      text not null,
  expense_date     date not null default current_date,
  supplier         text,
  invoice_number   text,
  linked_animal_id uuid references animals(id) on delete set null,
  linked_crop_id   uuid references crops(id) on delete set null,
  linked_sector_id uuid references sectors(id) on delete set null,
  linked_supply_id uuid references supplies(id) on delete set null,
  receipt_url      text,
  notes            text,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- SUPPLY MOVEMENTS
-- ============================================================
create table if not exists supply_movements (
  id                uuid primary key default uuid_generate_v4(),
  owner_id          uuid not null references profiles(id) on delete cascade,
  supply_id         uuid not null references supplies(id) on delete cascade,
  movement_type     text not null,
  quantity          numeric(10,2) not null,
  unit_cost         numeric(8,2),
  total_cost        numeric(10,2),
  reason            text,
  movement_date     date not null default current_date,
  linked_expense_id uuid references expenses(id) on delete set null,
  notes             text,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- TASKS
-- ============================================================
create table if not exists tasks (
  id               uuid primary key default uuid_generate_v4(),
  owner_id         uuid not null references profiles(id) on delete cascade,
  title            text not null,
  description      text,
  frequency        text not null default 'daily',
  frequency_days   integer[],
  time_of_day      text default 'anytime',
  category         text,
  linked_sector_id uuid references sectors(id) on delete set null,
  linked_animal_id uuid references animals(id) on delete set null,
  linked_crop_id   uuid references crops(id) on delete set null,
  is_active        boolean not null default true,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- TASK COMPLETIONS
-- ============================================================
create table if not exists task_completions (
  id             uuid primary key default uuid_generate_v4(),
  owner_id       uuid not null references profiles(id) on delete cascade,
  task_id        uuid not null references tasks(id) on delete cascade,
  completed_date date not null default current_date,
  completed_at   timestamptz,
  skipped        boolean not null default false,
  skip_reason    text,
  notes          text,
  created_at     timestamptz not null default now(),
  unique(task_id, completed_date)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_animals_owner       on animals(owner_id);
create index if not exists idx_animals_species     on animals(species_id);
create index if not exists idx_animals_sector      on animals(sector_id);
create index if not exists idx_animals_status      on animals(status);
create index if not exists idx_animal_events_animal on animal_events(animal_id);
create index if not exists idx_animal_events_type  on animal_events(event_type);
create index if not exists idx_animal_events_date  on animal_events(event_date desc);
create index if not exists idx_crops_owner         on crops(owner_id);
create index if not exists idx_crop_events_crop    on crop_events(crop_id);
create index if not exists idx_crop_events_date    on crop_events(event_date desc);
create index if not exists idx_task_completions_date on task_completions(completed_date desc);
create index if not exists idx_expenses_owner_date on expenses(owner_id, expense_date desc);
create index if not exists idx_supply_movements    on supply_movements(supply_id);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
create or replace function trigger_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_updated_at before update on profiles
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on sectors
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on animals
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on crops
  for each row execute function trigger_set_updated_at();
create trigger set_updated_at before update on supplies
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- TRIGGER: auto-generate animal_code (VAC-001, GAL-042)
-- ============================================================
create or replace function generate_animal_code()
returns trigger language plpgsql as $$
declare
  v_prefix text;
  v_num    integer;
begin
  select code into v_prefix from species where id = new.species_id;
  insert into animal_code_sequences(owner_id, species_id, last_number)
    values(new.owner_id, new.species_id, 1)
    on conflict(owner_id, species_id)
    do update set last_number = animal_code_sequences.last_number + 1
    returning last_number into v_num;
  new.animal_code := v_prefix || '-' || lpad(v_num::text, 3, '0');
  return new;
end;
$$;

create trigger auto_animal_code before insert on animals
  for each row
  when (new.animal_code is null or new.animal_code = '')
  execute function generate_animal_code();

-- ============================================================
-- TRIGGER: sync last weight to animals table
-- ============================================================
create or replace function sync_animal_weight()
returns trigger language plpgsql as $$
begin
  if new.event_type = 'weight' and new.weight_kg is not null then
    update animals set weight_kg = new.weight_kg, updated_at = now()
    where id = new.animal_id;
  end if;
  return new;
end;
$$;

create trigger on_weight_event after insert on animal_events
  for each row execute function sync_animal_weight();

-- ============================================================
-- TRIGGER: supply stock movements
-- ============================================================
create or replace function update_supply_stock()
returns trigger language plpgsql as $$
begin
  if new.movement_type = 'entrada' then
    update supplies set current_stock = current_stock + new.quantity where id = new.supply_id;
  elsif new.movement_type = 'salida' then
    update supplies set current_stock = current_stock - new.quantity where id = new.supply_id;
  elsif new.movement_type = 'ajuste' then
    update supplies set current_stock = new.quantity where id = new.supply_id;
  end if;
  return new;
end;
$$;

create trigger on_supply_movement after insert on supply_movements
  for each row execute function update_supply_stock();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles(id, full_name)
  values(new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- RLS
-- ============================================================
alter table profiles              enable row level security;
alter table species               enable row level security;
alter table sectors               enable row level security;
alter table animals               enable row level security;
alter table animal_code_sequences enable row level security;
alter table animal_events         enable row level security;
alter table crops                 enable row level security;
alter table crop_events           enable row level security;
alter table tasks                 enable row level security;
alter table task_completions      enable row level security;
alter table expenses              enable row level security;
alter table supplies              enable row level security;
alter table supply_movements      enable row level security;

create policy "profiles: own" on profiles for all using (id = auth.uid());
create policy "species: own" on species for all using (owner_id = auth.uid());
create policy "sectors: own" on sectors for all using (owner_id = auth.uid());
create policy "animals: own" on animals for all using (owner_id = auth.uid());
create policy "sequences: own" on animal_code_sequences for all using (owner_id = auth.uid());
create policy "animal_events: own" on animal_events for all using (owner_id = auth.uid());
create policy "crops: own" on crops for all using (owner_id = auth.uid());
create policy "crop_events: own" on crop_events for all using (owner_id = auth.uid());
create policy "tasks: own" on tasks for all using (owner_id = auth.uid());
create policy "task_completions: own" on task_completions for all using (owner_id = auth.uid());
create policy "expenses: own" on expenses for all using (owner_id = auth.uid());
create policy "supplies: own" on supplies for all using (owner_id = auth.uid());
create policy "supply_movements: own" on supply_movements for all using (owner_id = auth.uid());

-- ============================================================
-- RPC: Dashboard metrics (single round-trip)
-- ============================================================
create or replace function get_dashboard_metrics(p_owner_id uuid)
returns json language plpgsql as $$
declare result json;
begin
  select json_build_object(
    'total_animals_active',
      (select count(*) from animals where owner_id = p_owner_id and status = 'active'),
    'total_crops_active',
      (select count(*) from crops where owner_id = p_owner_id and status = 'active'),
    'tasks_today_total',
      (select count(*) from tasks where owner_id = p_owner_id and is_active = true),
    'tasks_today_done',
      (select count(*) from task_completions
       where owner_id = p_owner_id and completed_date = current_date and skipped = false),
    'expenses_this_month',
      (select coalesce(sum(amount),0) from expenses
       where owner_id = p_owner_id
       and date_trunc('month', expense_date) = date_trunc('month', current_date)),
    'low_stock_count',
      (select count(*) from supplies
       where owner_id = p_owner_id
       and min_stock_alert is not null and current_stock <= min_stock_alert),
    'animals_by_species',
      (select json_agg(t) from (
        select s.name, s.code, s.icon, count(a.id)::integer as count
        from animals a join species s on s.id = a.species_id
        where a.owner_id = p_owner_id and a.status = 'active'
        group by s.name, s.code, s.icon
       ) t),
    'recent_events',
      (select json_agg(t) from (
        select ae.event_type, ae.event_date, ae.notes,
               a.name as animal_name, a.animal_code, sp.icon as species_icon
        from animal_events ae
        join animals a on a.id = ae.animal_id
        join species sp on sp.id = a.species_id
        where ae.owner_id = p_owner_id
        order by ae.created_at desc
        limit 5
       ) t)
  ) into result;
  return result;
end;
$$;

-- ============================================================
-- SEED: default species
-- ============================================================
create or replace function seed_default_species(p_owner_id uuid)
returns void language plpgsql as $$
begin
  insert into species(owner_id, name, code, icon) values
    (p_owner_id, 'Gallinas',  'GAL', '🐔'),
    (p_owner_id, 'Vacas',     'VAC', '🐄'),
    (p_owner_id, 'Cerdos',    'CER', '🐷'),
    (p_owner_id, 'Ovejas',    'OVE', '🐑'),
    (p_owner_id, 'Cabras',    'CAB', '🐐'),
    (p_owner_id, 'Conejos',   'CON', '🐇'),
    (p_owner_id, 'Patos',     'PAT', '🦆'),
    (p_owner_id, 'Pavos',     'PAV', '🦃'),
    (p_owner_id, 'Caballos',  'CAB2','🐴')
  on conflict(owner_id, code) do nothing;

  insert into sectors(owner_id, name, type) values
    (p_owner_id, 'Gallinero Principal', 'galpon'),
    (p_owner_id, 'Potrero Norte',       'potrero'),
    (p_owner_id, 'Huerta',              'huerta')
  on conflict do nothing;
end;
$$;
