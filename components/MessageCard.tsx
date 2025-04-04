"use client";

import deleteMessage from "@/app/actions/deleteMessage";
import markMessageAsRead from "@/app/actions/markMessageAsRead";
import { useGlobalContext } from "@/context/GlobalContext";
import { MessageProps } from "@/types";
import { toast } from "react-toastify";

const MessageCard = ({
  property,
  body,
  name,
  email,
  phone,
  read,
  _id,
  createdAt,
}: MessageProps) => {
  const { setUnreadCount } = useGlobalContext();
  const handleReadClick = async () => {
    const checkRead = await markMessageAsRead(_id);
    setUnreadCount((prevCount) => (checkRead ? prevCount - 1 : prevCount + 1));
    toast.success(`Marked as ${checkRead ? "read" : "new"}`);
  };

  const handleDeleteClick = () => {
    deleteMessage(_id);
    setUnreadCount((prevCount) => (read ? prevCount : prevCount - 1));
    toast.success("Message Deleted");
  };

  return (
    <div
      key={property._id}
      className="relative bg-white p-4 rounded-md shadow-md border border-gray-200"
    >
      {!read && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md">
          New
        </div>
      )}
      <h2 className="text-xl mb-4">
        <span className="font-bold">Property Inquiry:</span>
        {property.name}
      </h2>
      <p className="text-gray-700">{body}</p>

      <ul className="mt-4">
        <li>
          <strong>Name:</strong> {name}
        </li>

        <li>
          <strong>Reply Email:</strong>
          <a href={`mailto:${email}`} className="text-blue-500">
            {email}
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>
          <a href={`tel:${phone}`} className="text-blue-500">
            {phone}
          </a>
        </li>
        <li>
          <strong>Received:</strong>
          {new Date(createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        onClick={handleReadClick}
        className="mt-4 mr-3 bg-blue-500 text-white py-1 px-3 rounded-md"
      >
        {read ? "Mark As New" : "Mark As Read"}
      </button>
      <button
        onClick={handleDeleteClick}
        className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
      >
        Delete
      </button>
    </div>
  );
};

export default MessageCard;
