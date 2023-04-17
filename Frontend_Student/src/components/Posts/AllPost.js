import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { PencilAltIcon } from "@heroicons/react/outline";
// import { Dropdown } from '@cube-ui/components';
import { fetchCategoriesAction } from "../../redux/slices/category/categorySlice";
import DateFormatter from "../../utils/DateFormatter";
import LoadingComponent from "../../utils/LoadingComponent";
import { fetchPostsAction } from "../../redux/slices/posts/postSlices";
import { fetchUsersAction, userProfileAction } from "../../redux/slices/users/usersSlices";

const AllPost = () => {
    //select post from store
    const post = useSelector(state => state?.post);
    const { postLists, loading, appErr, serverErr } = post;

    //select categories from store
    const category = useSelector(state => state?.category);
    const {
        categoryList,
        loading: catLoading,
        appErr: catAppErr,
        serverErr: catServerErr,
    } = category;


    //dispatch
    const dispatch = useDispatch();
    //fetch post
    useEffect(() => {
        dispatch(fetchPostsAction(""));
    }, [dispatch]);
    //fetch categories
    useEffect(() => {
        dispatch(fetchCategoriesAction());
    }, [dispatch]);
    return (
        <>
            {loading ? (
                <>
                    <LoadingComponent />
                </>
            ) : appErr || serverErr ? (
                <h2 className="text-center text-3xl text-red-600">
                    {serverErr} {serverErr}
                </h2>
            ) : post?.length <= 0 ? (
                <h2 className="text-center text-3xl text-green-800">
                    No post Found
                </h2>
            ) : (
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-8 py-3 text-left text-xs font-medium text-gray-500  tracking-wider"
                                            >
                                                Post Title
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider"
                                            >
                                                Author
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider"
                                            >
                                                Created At
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider"
                                            >
                                                Student List
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {postLists?.map(post => (
                                            <tr className="bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">

                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img
                                                                className="h-10 w-10 rounded-full"
                                                                src={post?.image}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {post?.title}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">

                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img
                                                                className="h-10 w-10 rounded-full"
                                                                src={post?.user?.profilePhoto}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">

                                                                {post?.user?.firstName}{" "}
                                                                {post?.user?.lastName}

                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {post?.user?.email}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {<DateFormatter date={post?.createdAt} />}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <ul className="">

                                                        {post?.Register?.length <= 0 ? (
                                                            <h1>No Registration</h1>
                                                        ) : (

                                                            post?.Register?.map(student => (
                                                                <div className="text-sm font-medium text-gray-600">
                                                                    <Link
                                                                        to={`/profile/${student?._id}`}
                                                                        className=" hover:underline "
                                                                    >
                                                                        {student.firstName}{" "}
                                                                        {student.lastName}
                                                                    </Link>
                                                                </div>))
                                                        )}

                                                    </ul>


                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllPost;
