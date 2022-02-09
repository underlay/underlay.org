-- Trigger and function for new User
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
  DECLARE new_slug text := LOWER(UNACCENT(CONCAT(regexp_replace(new.raw_user_meta_data ->> 'name', '[^\w]+','','g'), ROUND(RANDOM()*9),ROUND(RANDOM()*9),ROUND(RANDOM()*9),ROUND(RANDOM()*9),ROUND(RANDOM()*9))));
  BEGIN
	INSERT INTO public.namespaces (id, slug) VALUES (uuid_generate_v4(), new_slug);

    INSERT INTO public.users (
      id,
      email,
      name,
      namespace_id,
      avatar
    )
    VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'this_name'),
      (select id from public.namespaces where slug = new_slug),
      new.raw_user_meta_data ->> 'avatar'
    );
    RETURN NEW;
  END;
$$
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = extensions, public, pg_temp;

-- trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_user_created on auth.users;
CREATE TRIGGER on_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Trigger and function for updated User
-- update a row in public."Users" when the email is updated
CREATE OR REPLACE FUNCTION handle_updated_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET email = new.email
  WHERE id = new.id::text;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

-- trigger the function every time a user is updated
DROP TRIGGER IF EXISTS on_user_updated on auth.users;
CREATE TRIGGER on_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE handle_updated_user();