import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import {
  RegisterationStudent,
  deletePostAction,
  fetchPostDetailsAction,
} from "../../redux/slices/posts/postSlices";
import { useDispatch, useSelector } from "react-redux";
import DateFormatter from "../../utils/DateFormatter";
import LoadingComponent from "../../utils/LoadingComponent";
import AddComment from "../Comments/AddComment";
import CommentsList from "../Comments/CommentsList";

const PostDetails = ({
  match: {
    params: { id },
  },
}) => {
  const dispatch = useDispatch();

  //select post details from store
  const post = useSelector(state => state?.post);
  const { postDetails, loading, appErr, serverErr, isDeleted } = post;

  //comment
  const comment = useSelector(state => state.comment);
  const { commentCreated, commentDeleted } = comment;
  useEffect(() => {
    dispatch(fetchPostDetailsAction(id));
  }, [id, dispatch, commentCreated, commentDeleted]);

  //Get login user
  const user = useSelector(state => state.users);
  const { userAuth, } = user;
  console.log(userAuth._id)
  useEffect(() => {
    dispatch(RegisterationStudent(id));
  }, [userAuth?.id, dispatch]);

  const isCreatedBy = postDetails?.user?._id === userAuth?._id;
  console.log(isCreatedBy);
  //redirect
  if (isDeleted) return <Redirect to="/posts" />;
  console.log(postDetails)
  return (
    <>
      {loading ? (
        <div className="h-screen">
          <LoadingComponent />
        </div>
      ) : appErr || serverErr ? (
        <h1 className="h-screen text-red-400 text-xl">
          {serverErr} {appErr}
        </h1>
      ) : (
        <section className="py-20 2xl:py-40 bg-gray-800 overflow-hidden">
          <div className="">
            {/* Post Image */}
            <img
              className="mb-24 w-full h-96 object-cover"
              src={postDetails?.image}
              alt=""
            />
            <div className="mx-52 flex flex-col text-center">
              <h2 className="mt-7 mb-14 text-6xl 2xl:text-7xl text-white font-bold font-heading">
                {postDetails?.title}
              </h2>

              {/* User */}
              <div className="inline-flex pt-14 mb-14 items-center border-t border-gray-500">
                <img
                  className="mr-8 w-20 lg:w-24 h-20 lg:h-24 rounded-full"
                  src={postDetails?.user?.profilePhoto}
                  alt=""
                />
                <div className="text-left">
                  <Link to={`/profile/${postDetails?.user?._id}`}>
                    <h4 className="mb-1 text-2xl font-bold text-gray-50">
                      <span className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-orange-600 ">
                        {postDetails?.user?.firstName}{" "}
                        {postDetails?.user?.lastName}{" "}
                      </span>
                    </h4>
                  </Link>
                  <p className="text-gray-500">
                    {<DateFormatter date={post?.createdAt} />}
                  </p>
                </div>
              </div>
              {/* Post description */}
              <div class=" mx-auto">
                <p class=" mb-7 text-left  text-xl text-gray-200">
                  {postDetails?.description?.split("").map((c) => {
                    if (c == "\n") return <br />
                    else return c;
                  })}

                  {/* Show delete and update  if it was created by the user */}
                  {isCreatedBy ? (
                    <p class="flex">
                      <Link to={`/update-post/${postDetails?._id}`} class="p-3">
                        <PencilAltIcon class="h-8 mt-3 text-yellow-300" />
                      </Link>
                      <button
                        onClick={() =>
                          dispatch(deletePostAction(postDetails?._id))
                        }
                        class="ml-3"
                      >
                        <TrashIcon class="h-8 mt-3 text-red-600" />
                      </button>
                    </p>
                  ) : null}
                </p>
              </div>
            </div>
          </div>

          <div className="flex mx-52    mt-16 items-center">

            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded "
              onClick={() =>
                dispatch(RegisterationStudent(id))
              } >
              Regisrer Here
            </button>

          </div>
          <div className="px-12 mt-12" />
          {/* Add comment Form component here */}
          {userAuth ? <AddComment postId={id} /> : null}
          <div className="flex justify-center  items-center ">
            {/* <CommentsList comments={post?.comments} postId={post?._id} /> */}
            <CommentsList comments={postDetails?.comments} />

          </div>
        </section>
      )}
    </>
  );
};

export default PostDetails;
