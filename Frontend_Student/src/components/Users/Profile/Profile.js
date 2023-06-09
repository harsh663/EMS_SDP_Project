import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  HeartIcon,
  EmojiSadIcon,
  UploadIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { MailIcon, EyeIcon } from "@heroicons/react/solid";
import {
  userProfileAction,

} from "../../../redux/slices/users/usersSlices";
import { useDispatch, useSelector } from "react-redux";
import DateFormatter from "../../../utils/DateFormatter";
import LoadingComponent from "../../../utils/LoadingComponent";
import { fetchPostsAction } from "../../../redux/slices/posts/postSlices";

export default function Profile(props) {
  const dispatch = useDispatch();
  const id = props.computedMatch.params.id;
  //History
  const history = useHistory();
  const [registeredEvents, setRegisteredEvents] = useState([])

  //User data from store
  const users = useSelector(state => state.users);
  const fetchRegisteredEvents = async () => {

    const allPosts = await dispatch(fetchPostsAction(""));
    let registeredPosts = [];
    console.log("ap ", allPosts.payload)

    allPosts.payload.forEach((post) => {
      let isRegistered = false;
      post.Register.forEach((user) => {
        if (user._id === userAuth._id) {
          isRegistered = true;
        }
      })
      if (isRegistered) {
        registeredPosts.push(post);
      }
    })
    setRegisteredEvents(registeredPosts)
  }
  const {
    profile,
    profileLoading,
    profileAppErr,
    profileServerErr,
    followed,
    unFollowed,
    userAuth,
  } = users;

  //fetch user profile
  useEffect(() => {
    dispatch(userProfileAction(id));
    fetchRegisteredEvents();


  }, [id, dispatch]);

  //send mail handle click
  const sendMailNavigate = () => {
    history.push({
      pathname: "/send-mail",
      state: {
        email: profile?.email,
        id: profile?._id,
      },
    });
  };

  //isLogin

  const isLoginUser = userAuth?._id === profile?._id;

  return (
    <>
      <div className="min-h-screen bg-gray-700 flex justify-center items-center">
        {profileLoading ? (
          <LoadingComponent />
        ) : profileAppErr || profileServerErr ? (
          <h2 className="text-yellow-400 text-2xl">
            {profileServerErr} {profileAppErr}
          </h2>
        ) : (
          <div className="h-screen flex overflow-hidden bg-white">
            {/* Static sidebar for desktop */}

            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
              <div className="flex-1 relative z-0 flex overflow-hidden">
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
                  <article>
                    {/* Profile header */}
                    <div>
                      <div>
                        <img
                          className="h-32 w-full object-cover lg:h-48"
                          src={profile?.profilePhoto}
                          alt={profile?.firstName}
                        />
                      </div>
                      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                          <div className="flex -mt-20">
                            <img
                              className="h-24 w-24 rounded-full  ring-4 ring-white sm:h-32 sm:w-32"
                              src={profile?.profilePhoto}
                              alt={profile?.firstName}
                            />
                          </div>
                          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                            <div className=" flex flex-col 2xl:block mt-10 min-w-0 flex-1">
                              <h1 className="text-2xl font-bold text-gray-900 ">
                                {/* {profile?.firstName} {profile?.lastName} */}
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                  {profile?.accountType}
                                </span>
                                {/* Display if verified or not */}
                                {profile?.isAccountVerified ? (
                                  <span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-green-600 text-gray-300">
                                    Account Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-red-600 text-gray-300">
                                    Unverified Account
                                  </span>
                                )}
                              </h1>
                              <p className="m-3 text-lg">
                                Date Joined: {""}
                                <DateFormatter date={profile?.createdAt} />{" "}
                              </p>
                              <h2 className="text-blue-900 mt-2 mb-2">Bio:</h2>

                              <p className="text-black mt-0 mb-0">
                                {profile?.bio}

                              </p>
                              {/* Who view my profile */}
                              <div className="flex items-center  mb-2">
                                <div className="pl-2">

                                </div>
                              </div>

                              {/* is login user */}
                              {/* Upload profile photo */}
                              {isLoginUser && (
                                <Link
                                  to={`/upload-profile-photo`}
                                  className="inline-flex justify-center w-48 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                  <UploadIcon
                                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span>Upload Photo</span>
                                </Link>
                              )}
                            </div>

                            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">


                              {/* Update Profile */}

                              <>
                                {isLoginUser && (
                                  <Link
                                    to={`/update-profile/${profile?._id}`}
                                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                  >
                                    <UserIcon
                                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span>Update Profile</span>
                                  </Link>
                                )}
                              </>
                              {/* Send Mail */}
                              <button
                                onClick={sendMailNavigate}
                                className="inline-flex justify-center bg-indigo-900 px-4 py-2 border border-yellow-700 shadow-sm text-sm font-medium rounded-md text-gray-700  hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                              >
                                <MailIcon
                                  className="-ml-1 mr-2 h-5 w-5 text-gray-200"
                                  aria-hidden="true"
                                />
                                <span className="text-base mr-2  text-bold text-yellow-500">
                                  Send Message
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                          <h1 className="text-2xl font-bold text-gray-900 truncate">
                            {profile?.firstName} {profile?.lastName}
                          </h1>
                        </div>
                      </div>
                    </div>
                    {/* Tabs */}
                    <div className="mt-6 sm:mt-2 2xl:mt-5">
                      <div className="border-b border-red-900">
                        <div className="max-w-5xl mx-auto "></div>
                      </div>
                    </div>
                    <div className="flex justify-center place-items-start flex-wrap  md:mb-0">



                      {/* All my Post */}
                      <div className="w-full md:w-2/3 px-4 mb-4 md:mb-0">
                        <h1 className="text-center text-xl border-gray-500 mb-2 border-b-2">
                          Registered Event
                        </h1>
                        {/* Loop here
                        {profile?.posts?.length <= 0 ? (
                          <h2 className="text-center text-xl">No Post Found</h2>
                        ) : (
                          profile?.posts?.map(post => (
                            <div className="flex flex-wrap  -mx-3 mt-3  lg:mb-6">
                              <div className="mb-2   w-full lg:w-1/4 px-3">
                                <Link>
                                  <img
                                    className="object-cover h-40 rounded"
                                    src={post?.image}
                                    alt="poster"
                                  />
                                </Link>
                              </div>
                              <div className="w-full lg:w-3/4 px-3">
                                <Link
                                  // to={`/post/${post?._id}`}
                                  className="hover:underline"
                                >
                                  <h3 className="mb-1 text-2xl text-green-600 font-bold font-heading">
                                    {post?.title}
                                  </h3>
                                </Link>
                                <p className="text-gray-600 truncate">
                                  {post?.description}
                                </p>

                                <Link
                                  className="text-indigo-500 hover:underline"
                                  to={`/posts/${post?._id}`}
                                >
                                  Read more
                                </Link>
                              </div>
                            </div>
                          ))
                        )} */}

                        {registeredEvents.map((event) => {
                          return <div className="flex flex-wrap  -mx-3 mt-3  lg:mb-6">
                            <div className="mb-2   w-full lg:w-1/4 px-3">
                              <Link to={`/posts/${event?._id}`}>
                                <img
                                  className="object-cover h-40 rounded"
                                  src={event?.image}
                                  alt="poster"
                                />
                              </Link>
                            </div>
                            <div className="w-full lg:w-3/4 px-3">
                              <Link
                                to={`/posts/${event?._id}`}
                                className="hover:underline"
                              >
                                <h3 className="mb-1 text-2xl text-green-600 font-bold font-heading">
                                  {event?.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600 truncate">
                                {event?.description}
                              </p>

                              <Link
                                className="text-indigo-500 hover:underline"
                                to={`/posts/${event?._id}`}
                              >
                                Read more
                              </Link>
                            </div>
                          </div>

                        })}
                      </div>
                    </div>
                  </article>
                </main>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
