"use client";

import { FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import bookmarkProperty from "@/app/actions/bookmarkProperty";
import { PropertyCardProps } from "@/types";
import { useEffect, useState } from "react";
import checkBookmarkStatus from "@/app/actions/checkBookmarkStatus";
import SpinnerMini from "./SpinnerMini";

const BookmarkButton = ({ _id }: PropertyCardProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBookmark = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const result = await checkBookmarkStatus(_id);
        if (result.isBookmarked) setIsBookmarked(result.isBookmarked);
        setLoading(false);
      } catch (error) {
        toast.error(
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "An error occurred while bookmarking the property"
        );
        setLoading(false);
      }
    };
    checkBookmark();
  }, [_id, userId, checkBookmarkStatus]);

  const handleClick = async () => {
    setLoading(true);
    if (!userId) {
      toast.error("You need to be signed in to bookmark a listing");
      setLoading(false);
      return;
    }

    try {
      const result = await bookmarkProperty(_id);

      setIsBookmarked(result.isBookmarked);

      toast.success(result.message);

      setLoading(false);
    } catch (error) {
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "An error occurred while bookmarking the property"
      );
      setLoading(false);
    }
  };

  return isBookmarked ? (
    loading ? (
      <button
        disabled
        className="bg-white text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      >
        <SpinnerMini />
      </button>
    ) : (
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
        onClick={handleClick}
      >
        <FaBookmark className="mr-2" /> Remove Bookmark
      </button>
    )
  ) : loading ? (
    <button
      disabled
      className="bg-white text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <SpinnerMini />
    </button>
  ) : (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
      onClick={handleClick}
    >
      <FaBookmark className="mr-2" /> Bookmark Property
    </button>
  );
};

export default BookmarkButton;
