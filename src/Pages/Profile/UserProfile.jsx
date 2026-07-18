import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import useGet from "../../CustomHooks/useGetPosts";
import PostCard from "../../Components/Posts/PostCard";
import LoadingSkeleton from "../../Components/LoadingSkeleton/LoadingSkeleton";
import useToggleFollow from "../../CustomHooks/useToggleFollow";
import ShowImage from "../../utils/ShowImage";
import AuthContext from "../../Contexts/AuthContext/authContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { profileData } = useContext(AuthContext);
  const { id } = useParams();

  const { data: userData } = useGet(
    ["userData", id],
    `users/${id}/profile`,
    Boolean(id),
  );
  const UserInfo = userData?.data?.data?.user;

  const { data: userPosts, isLoading: isPosting } = useGet(
    ["userPosts", UserInfo?._id],
    `users/${UserInfo?._id}/posts`,
    Boolean(UserInfo?._id),
  );
  const posts = userPosts?.data?.data?.posts;

  const following = UserInfo?.followers?.some(
    (follower) => follower._id === profileData?._id,
  );

  const [isFollowing, setIsFollowing] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const { mutate, isPending } = useToggleFollow();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/feed");
  }, [navigate]);

  const handleToggleFollow = useCallback(() => {
    mutate(UserInfo?._id);
    setIsFollowing((prev) => !prev);
  }, [mutate, UserInfo?._id]);

  const handleShowImage = useCallback(() => setShowImageViewer(true), []);

  const imageInfo = useMemo(
    () => ({
      photo: UserInfo?.photo,
      name: UserInfo?.name,
    }),
    [UserInfo?.photo, UserInfo?.name],
  );

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-20 md:px-30 xl:px-40 py-20">
      <Helmet>
        <title>
          {UserInfo?.name
            ? `${UserInfo.name} Profile | Route Posts`
            : "profile | Route Posts"}
        </title>
      </Helmet>

      <div className="min-w-0">
        <button
          onClick={handleBack}
          className="inline-flex m-5 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="h-48 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)]" />
          <div className="relative -mt-14 px-3 pb-5 sm:px-5">
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-white/70 bg-white/95 p-4 dark:border-slate-700/70 dark:bg-slate-900/95">
              <div className="flex items-end gap-3">
                <img
                  onClick={handleShowImage}
                  alt={UserInfo?.name}
                  className="h-28 w-28 cursor-pointer rounded-full border-4 border-white object-cover shadow-md ring-2 ring-blue-100 dark:border-slate-900 dark:ring-blue-900/40"
                  src={UserInfo?.photo}
                />
                <div>
                  <p className="text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
                    {UserInfo?.name}
                  </p>
                  <p className="text-sm font-semibold text-slate-500 sm:text-base dark:text-slate-400">
                    {UserInfo?.email ?? "loading_email@example.com"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleFollow}
                disabled={isPending}
                type="button"
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold transition sm:w-auto
                  ${isPending ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                  ${
                    isFollowing
                      ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      : "bg-[#1877f2] text-white hover:bg-[#166fe5] dark:bg-[#3454c7] dark:hover:bg-[#2843a8]"
                  }`}
              >
                {isPending ? (
                  "Loading..."
                ) : isFollowing ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} /> Following
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUserPlus} /> Follow
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="my-5">
          {isPosting ? (
            <LoadingSkeleton />
          ) : !posts?.length ? (
            <p className="text-center text-gray-400 mt-10 dark:text-slate-500">No posts yet.</p>
          ) : (
            posts.map((post) => <PostCard post={post} key={post._id} />)
          )}
        </div>
      </div>

      <ShowImage
        showImageViewer={showImageViewer}
        setShowImageViewer={setShowImageViewer}
        Info={imageInfo}
      />
    </div>
  );
};

export default React.memo(UserProfile);