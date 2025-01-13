import React from "react";
import PropTypes from "prop-types";
const Item = ({ index, name, price, quantity,item }) => {
  return (
    <div className="flex items-start space-x-4 mt-2 border-t pt-2 hover:scale-110 duration-300 hover:bg-light hover:p-2 rounded-lg">
      <div className="flex-none text-sm px-1 rounded-md text-gray-500 font-medium bg-light">
        {index}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      <div className="flex-none text-right">
        <div className="text-gray-700">Price:  {price}</div>
        <div className="text-gray-700">Quantity: {quantity}</div>
        
      </div>
    </div>
  );
};

Item.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
};

export default Item;
