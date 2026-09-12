"use client";

import React, { useState } from "react";

import { FiExternalLink, FiPlay, FiX } from "react-icons/fi";

import {
  useGetAllYoutubeLinksApiQuery,
} from "@/redux/system.features/system.youtube.link.features";

const getYoutubeData = (url: string) => {
  try {
    const youtubeUrl = new URL(url);

    let videoId = "";

    if (youtubeUrl.hostname.includes("youtu.be")) {
      videoId = youtubeUrl.pathname.slice(1).split("?")[0];
    }

    if (youtubeUrl.hostname.includes("youtube.com")) {
      videoId = youtubeUrl.searchParams.get("v") || "";

      if (youtubeUrl.pathname.startsWith("/shorts/")) {
        videoId = youtubeUrl.pathname
          .split("/shorts/")[1]
          ?.split("?")[0];
      }

      if (youtubeUrl.pathname.startsWith("/embed/")) {
        videoId = youtubeUrl.pathname
          .split("/embed/")[1]
          ?.split("?")[0];
      }
    }

    if (!videoId) {
      return {
        videoId: "",
        thumbnail: "",
        embedUrl: url,
      };
    }

    return {
      videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
    };
  } catch {
    return {
      videoId: "",
      thumbnail: "",
      embedUrl: url,
    };
  }
};

export default function VideoLinkPage() {
  const {
    data,
    isLoading,
    isFetching,
  } = useGetAllYoutubeLinksApiQuery({});

  const [selectedVideo, setSelectedVideo] = useState<string | null>(
    null
  );

  const youtubeLinks = data?.data || [];

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <div className="mb-3 inline-flex items-center rounded-full bg-[#039A63]/10 px-4 py-1.5 text-sm font-medium text-[#039A63]">
              আমাদের ভিডিও
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              ভিডিও গাইড ও টিউটোরিয়াল
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              আমাদের সফটওয়্যার সম্পর্কে বিস্তারিত জানতে
              ভিডিওগুলো দেখুন এবং সহজেই বিভিন্ন ফিচার ব্যবহার
              করতে শিখুন।
            </p>
          </div>

          {/* Loading */}
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="aspect-video animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />

                    <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : youtubeLinks.length === 0 ? (
            /* Empty */
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#039A63]/10 text-[#039A63]">
                  <FiPlay className="h-6 w-6" />
                </div>

                <h3 className="text-base font-semibold text-gray-800">
                  কোনো ভিডিও পাওয়া যায়নি
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  নতুন ভিডিও শীঘ্রই যুক্ত করা হবে।
                </p>
              </div>
            </div>
          ) : (
            /* Videos */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {youtubeLinks.map(
                (item: any, index: number) => {
                  const video = getYoutubeData(item.link);

                  return (
                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Thumbnail */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedVideo(
                            video.embedUrl
                          )
                        }
                        className="relative block aspect-video w-full cursor-pointer overflow-hidden bg-gray-100"
                      >
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={`ভিডিও ${index + 1
                              }`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <FiPlay className="h-10 w-10 text-gray-400" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition duration-300 group-hover:bg-black/40">
                          <div className="flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-white text-[#039A63] shadow-lg transition duration-300 group-hover:scale-110">
                            <FiPlay className="ml-1 h-6 w-6 fill-current" />
                          </div>
                        </div>

                        {/* Video badge */}
                        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur">
                          ভিডিও
                        </div>
                      </button>

                      {/* Content */}
                      <div className="p-5">
                        <div className="mb-4">
                          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-gray-800 transition-colors group-hover:text-[#039A63]">
                            সফটওয়্যার ব্যবহারের
                            ভিডিও টিউটোরিয়াল
                          </h3>

                          <p
                            className="mt-2 truncate text-xs text-gray-400"
                            title={item.link}
                          >
                            {item.link}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          {/* Play */}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedVideo(
                                video.embedUrl
                              )
                            }
                            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#039A63] px-4 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-[#027d50]"
                          >
                            <FiPlay className="h-4 w-4 fill-current" />

                            ভিডিও দেখুন
                          </button>

                          {/* YouTube */}
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-[42px] w-[46px] items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#039A63] hover:text-[#039A63]"
                            title="YouTube-এ দেখুন"
                          >
                            <FiExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Bottom CTA */}
          {youtubeLinks.length > 0 && (
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500">
                সফটওয়্যার ব্যবহারে কোনো সমস্যা হলে আমাদের
                ভিডিও গাইডগুলো অনুসরণ করুন।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeVideo}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500"
            >
              <FiX className="h-5 w-5" />
            </button>

            {/* Video */}
            <div className="aspect-video w-full">
              <iframe
                src={selectedVideo}
                title="YouTube video player"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}