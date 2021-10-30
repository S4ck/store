import fetch from "isomorphic-unfetch";
import { nanoid } from "nanoid";

//fetcher
export const fetcher = (url) => fetch(url).then((r) => r.json());

export const getFormValidations = () => {
  return {
    //name
    name: {
      required: {
        value: true,
        message: "Tu Nombre es Requerido",
      },
      maxLength: {
        value: 20,
        message: "Max 20 Caracteres",
      },
      minLength: {
        value: 5,
        message: "Min 5 Caracteres",
      },
      pattern: {
        value: /^[A-Za-z ]{5,20}$/,
        message: "Nombre Incorrecto",
      },
    },

    //phone
    phone: {
      required: {
        value: true,
        message: "Tu Teléfono es Requerido",
      },
      maxLength: {
        value: 10,
        message: "Max 10 Caracteres",
      },
      minLength: {
        value: 9,
        message: "Min 9 Caracteres",
      },
      pattern: {
        value: /^[0-9]{9,10}$/,
        message: "Teléfono Incorrecto",
      },
    },
    //address
    address: {
      required: {
        value: true,
        message: "Dirección Requerida",
      },
      maxLength: {
        value: 20,
        message: "Max 20 caracteres",
      },
      minLength: {
        value: 5,
        message: "Min 5 caracteres",
      },
      pattern: {
        value: /^[0-9a-zA-Z ]{5,20}$/,
        message: "Dirección Incorrecta",
      },
    },
    //city
    city: {
      required: {
        value: true,
        message: "Ciudad Requerida",
      },
    },
    //schedule
    schedule: {
      required: {
        value: true,
        message: "Horario Requerido",
      },
    },
    //extra comment
    comment: {
      maxLength: {
        value: 25,
        message: "Max 25 caracteres",
      },
    },
  };
};

//wsp url creator
export function getWspUrl(orderData) {
  const N = process.env.NEXT_PUBLIC_MY_PHONE_NUMBER;
  const ID = nanoid(8);
  const { cartItems, subTotal, withDelivery, shippingCost, total, formData } = orderData;
  const { name, phone, address, city, schedule, comment } = formData;

  let cartListforUrl = "";

  {
    Object.values(cartItems).forEach((item) => {
      const itemTotal = (item.offerPrice ? item.offerPrice * item.qty : item.price * item.qty).toFixed(2);
      cartListforUrl += `%0A%0A - *(${item.qty})* ${item.title} --> _*$${itemTotal}*_`;
    });
  }

  const WSP_URL = `https://api.whatsapp.com/send/?phone=${N}&text=%2A${"Order"}%3A%2A%20${ID}%0A%0A%2A${"Client"}%3A%2A%20${name}%0A%0A%2A${"Phone"}%3A%2A%20${phone}%0A%0A%2A${
    withDelivery ? "Address" + "%3A%2A%20" + address + " %0A%0A%2A" : ""
  }${withDelivery ? "City" + "%3A%2A%20" + city + "%0A%0A%2A" : ""}${
    withDelivery ? "Schedule" + "%3A%2A%20" + schedule + "%0A%0A%2A" : ""
  }${comment ? "Comment" + "%3A%2A%20" + comment + "%0A%0A%2A" : ""}${"Items List"}%3A%2A${cartListforUrl}%0A%0A%2A${
    withDelivery ? "Sub Total" + "%3A%2A%20$" + subTotal + " %0A%0A%2A" : ""
  }${withDelivery ? "Delivery Fee" + "%3A%2A%20$" + shippingCost + " %0A%0A%2A" : ""}S/{"Total"}%3A%2A%20${total}%0A%0A`;

  return WSP_URL;
}
