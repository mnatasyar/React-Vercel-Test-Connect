/* eslint-disable react/prop-types */
import { Heart, HeartOff } from "lucide-react";

const CourseCard = ({ course, isFavorited, onToggleFavorite }) => {
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    try {
      await onToggleFavorite(course);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold flex-grow">{course.title}</h3>
        <button
          onClick={handleToggleFavorite}
          className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          {isFavorited ? (
            <Heart className="w-6 h-6 text-red-500" />
          ) : (
            <HeartOff className="w-6 h-6 text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>
      <p className="text-gray-600 mb-3">{course.shortIntro}</p>
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-col text-sm text-gray-500">
          <span className="text-xs">
            <span className="text-xs">
              {course.category} - {course.interest}
            </span>
          </span>
        </div>
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Enroll Now
        </a>
      </div>
    </div>
  );
};

export default CourseCard;
