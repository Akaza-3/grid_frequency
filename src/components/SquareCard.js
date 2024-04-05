import React from "react";

const SquareCard = ({ name, time, link = null }) => {
  const date = new Date(time * 1000);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  const graphHandler = () => {
    alert(`no graph currently for ${name}`);

    //enter the graph url here.... search the graph using model name passed as parameter ya phir jisse upload ke time dikha rahe usse krna?
  };

  return (
    <div className="flex items-center justify-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 py-4">
      {link === null ? <a href="/addModels " /> : ""}
      <div
        className="w-full bg-gray-200 rounded-lg shadow-md overflow-hidden relative cursor-pointer"
        onClick={graphHandler}
      >
        <div className="h-20 p-4 relative">
          <h2 className="text-xl font-semibold text-gray-800 absolute top-2 left-2">
            {name}
          </h2>
          <p className="text-sm text-gray-600 absolute bottom-2 right-2">
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SquareCard;
