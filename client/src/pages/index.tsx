import type { NextPage } from "next";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import AddButton from "@components/shared/AddButton";
import DateUtils from "@utils/dateUtils";

const IndexPage: NextPage = () => {
  // const [movements, setMovements] = useState<Movement[]>([])
  const [isLoading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    setLoading(true);
    Promise.resolve()
      // .then(() => setMovements(mockedMovements))
      .then(() => setLoading(false));
  }, [selectedDate]);

  const dayBefore = () => {
    const yesterday = new Date(selectedDate.getTime());
    yesterday.setDate(selectedDate.getDate() - 1);
    setSelectedDate(yesterday);
  };
  const dayAfter = () => {
    const tomorrow = new Date(selectedDate.getTime());
    tomorrow.setDate(selectedDate.getDate() + 1);
    setSelectedDate(tomorrow);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className={`flex mx-auto justify-center flex-col mx-4 relative`}>
      <div className={`flex justify-between items-center justify-center `}>
        <h1 className={`my-4 mx-auto text-lg text-white`}>Meals</h1>
      </div>
      <div
        className={`rounded-full bg-slate-800 flex justify-between py-3 text-gray-500 font-light 
            `}
      >
        <ArrowLeftIcon className={`h-6 ml-4`} onClick={() => dayBefore()} />
        <p className={`px-8`}>{DateUtils.convertToReadable(selectedDate)}</p>
        <ArrowRightIcon className={`h-6 mr-4 `} onClick={() => dayAfter()} />
      </div>
      {!DateUtils.isToday(selectedDate) && (
        <p
          className={`text-center text-gray-600 text-sm mt-2 underline`}
          onClick={() => setSelectedDate(new Date())}
        >
          Back to today
        </p>
      )}
      <AddButton action={() => null} />
    </main>
  );
};

export default IndexPage;
