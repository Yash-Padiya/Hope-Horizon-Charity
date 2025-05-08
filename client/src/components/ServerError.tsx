
type Props = {
  error: string | null;
};
function ServerError({ error }: Props) {
  return (
    <div className="bg-red-200 dark:bg-red-300 border border-red-400 text-2xl text-red-700 px-4 py-3 rounded-md w-full my-5">
      Oops!!! {error}. Try again later.
    </div>
  );
}

export default ServerError;
