import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import AuthContext from "../../AuthContext/authContext";
import useGet from "../../CustomHooks/useGetPosts";
import ProfileCover from "./ProfileCover";
import ProfileStats from "./ProfileStats";
import ProfileAbout from "./ProfileAbout";
import ProfilePostsSummary from "./ProfilePostsSummary";
import ProfileDisplaying from "./ProfileDisplaying";
import ProfilePhoto from "./ProfilePhoto";

const Profile = () => {
  const { profileData } = useContext(AuthContext);

  const { data, isLoading: isPosting } = useGet(
    ["userPosts", profileData?._id],
    `users/${profileData?._id}/posts`,
    Boolean(profileData?._id),
  );
  const posts = data?.data?.data?.posts;

  const { data: bookmarksData, isLoading: isSaving } = useGet(
    ["bookmarks"],
    "users/bookmarks",
    Boolean(profileData?._id),
  );
  const bookmarks = bookmarksData?.data?.data?.bookmarks;

  return (
    <main >
      <Helmet>
        <title>
          {profileData?.name
            ? `${profileData.name} Profile | Route Posts`
            : "profile | Route Posts"}
        </title>
      </Helmet>
      <div className="space-y-5 sm:space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
          <ProfileCover />
          <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6 max-w-[95%] md:max-w-[90%] xl:max-w-[80%] mx-auto">
            <div className="rounded-3xl border border-white/60 bg-white/92 p-5 backdrop-blur-xl sm:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <ProfilePhoto
                  photo={profileData?.photo}
                  name={profileData?.name}
                  username={profileData?.username}
                />
                <ProfileStats
                  following={profileData?.followingCount}
                  bookmarks={profileData?.bookmarksCount}
                  followers={profileData?.followersCount}
                />
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                <ProfileAbout email={profileData?.email} />
                <ProfilePostsSummary posts={posts} bookmarks={bookmarks} />
              </div>
              <div className="my-5">
                <ProfileDisplaying
                  posts={posts}
                  bookmarks={bookmarks}
                  isPosting={isPosting}
                  isSaving={isSaving}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
