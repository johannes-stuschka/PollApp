-- PollApp: run once in Supabase → SQL Editor.

create table surveys (
  id bigint generated always as identity primary key,
  title text not null check (length(trim(title)) > 0),
  category text not null,
  description text,
  end_date date,
  -- [{ "text": "...", "allowMultiple": false, "answers": ["A", "B"] }]
  questions jsonb not null check (jsonb_typeof(questions) = 'array' and jsonb_array_length(questions) > 0),
  created_at timestamptz not null default now()
);

-- One row per chosen answer.
create table votes (
  id bigint generated always as identity primary key,
  survey_id bigint not null references surveys (id) on delete cascade,
  question_index int not null check (question_index >= 0),
  answer_index int not null check (answer_index between 0 and 5),
  created_at timestamptz not null default now()
);

create view vote_counts with (security_invoker = true) as
  select survey_id, question_index, answer_index, count(*)::int as votes
  from votes
  group by survey_id, question_index, answer_index;

-- Everyone may read and add surveys and votes, nobody may change or delete them.
alter table surveys enable row level security;
alter table votes enable row level security;
create policy "read surveys" on surveys for select to anon, authenticated using (true);
create policy "create surveys" on surveys for insert to anon, authenticated with check (true);
create policy "read votes" on votes for select to anon, authenticated using (true);
-- No votes for closed surveys.
create policy "vote on open surveys" on votes for insert to anon, authenticated with check (
  exists (
    select 1 from surveys s
    where s.id = survey_id and (s.end_date is null or s.end_date >= current_date)
  )
);
-- New Supabase projects don't grant table access to the API roles automatically.
grant select, insert on surveys, votes to anon, authenticated;
grant select on vote_counts to anon, authenticated;

-- Live updates for the app.
alter publication supabase_realtime add table surveys, votes;

-- Demo data: run seed.sql next.
