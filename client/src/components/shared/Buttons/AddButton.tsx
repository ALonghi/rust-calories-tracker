import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddButton({ action }) {
  return (
    <>
      <button
        type="button"
        className="fixed bottom-7 right-7 inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white
                bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        onClick={() => action()}
      >
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </>
  );
}
