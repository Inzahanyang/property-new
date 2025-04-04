"use client";

import { PropertyCardProps } from "@/types";
import { FaClipboard } from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
  LineIcon,
} from "react-share";
import { toast } from "react-toastify";

const ShareButtons = ({ _id, name, type }: PropertyCardProps) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${_id}`;
  const clipBoard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Added your clipboard");
  };
  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share This Property:
      </h3>
      <div className="flex justify-center gap-2 pb-5">
        <FacebookShareButton
          url={shareUrl}
          title={name}
          hashtag={`#${type.replace(/\s/g, "")}forrent`}
        >
          <FacebookIcon round={true} size={40} />
        </FacebookShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={name}
          hashtags={[`${type.replace(/\s/g, "")} ForRent`]}
        >
          <TwitterIcon round={true} size={40} />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={name} separator="::">
          <WhatsappIcon round={true} size={40} />
        </WhatsappShareButton>
        <EmailShareButton
          url={shareUrl}
          title={name}
          body={`Check out this property listing: ${shareUrl}`}
        >
          <EmailIcon round={true} size={40} />
        </EmailShareButton>
        <LineShareButton url={shareUrl} title={name}>
          <LineIcon round={true} size={40} />
        </LineShareButton>
        <button
          onClick={clipBoard}
          className="bg-yellow-200 size-12 flex justify-center items-center rounded-full"
        >
          <FaClipboard size={24} className="text-gray-800" />
        </button>
      </div>
    </>
  );
};

export default ShareButtons;
