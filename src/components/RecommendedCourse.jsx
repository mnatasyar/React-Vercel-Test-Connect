import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CourseCard from "./CourseCard";

const API_URL =
  "https://course-recommendation-api-866939629489.asia-southeast2.run.app/api";

const RecommendedCourse = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    interest: "", // Sesuai dengan field baru
    course_type: "",
    duration: "",
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState({});

  // Updated interests list sesuai HTML
  const interests = [
    "Algorithms",
    "Animal Health",
    "Basic Science",
    "Business Essentials",
    "Bu siness Strategy",
    "Chemistry",
    "Cloud Computing",
    "Computer Security and Networks",
    "Data Analysis",
    "Data Management",
    "Design and Product",
    "Electrical Engineering",
    "Entrepreneurship",
    "Finance",
    "Health Informatics",
    "Healthcare Management",
    "History",
    "Leadership and Management",
    "Machine Learning",
    "Marketing",
    "Mechanical Engineering",
    "Mobile and Web Development",
    "Music and Art",
    "Nutrition",
    "Patient Care",
    "Personal Development",
    "Probability and Statistics",
    "Psychology",
    "Public Health",
    "Research",
    "Software Development",
  ];

  const courseTypes = [
    "Course",
    "Professional Certificate",
    "Project",
    "Specialization",
  ];

  // Updated durations sesuai HTML
  const durations = [
    { value: "1", label: "1-4 weeks" },
    { value: "12", label: "5-12 weeks" },
    { value: "24", label: "13-24 weeks" },
    { value: "39", label: "25-40 weeks" },
    { value: "60", label: "41-60 weeks" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interest: formData.interest, // Menggunakan field interest
          course_type: formData.course_type,
          duration: formData.duration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get recommendations");
      }

      const data = await response.json();
      setRecommendations({
        category: data.predicted_category,
        recommendations: data.recommended_courses.map((course, index) => ({
          id: index.toString(),
          title: course.title,
          shortIntro: course.short_intro,
          url: course.url,
          category: data.predicted_category,
          interest: formData.interest,
        })),
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleFavorite = async (course) => {
    if (!token) {
      setError("Please login to favorite courses");
      return;
    }

    try {
      const response = await fetch(
        "https://capstone-project-442014.et.r.appspot.com/api/favorites/toggle",
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(course),
        }
      );

      if (!response.ok) throw new Error("Failed to toggle favorite");

      setFavorites((prev) => ({
        ...prev,
        [course.id]: !prev[course.id],
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setError("Failed to update favorite status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Course Recommendations</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-2">Interest</label>
          <select
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select your interest</option>
            {interests.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Course Type</label>
          <select
            name="course_type"
            value={formData.course_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select course type</option>
            {courseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Duration (in weeks)</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select duration</option>
            {durations.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200"
        >
          {loading ? "Getting Recommendations..." : "Get Recommendations"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {recommendations && (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">
              Predicted Category: {recommendations.category}
            </h3>
          </div>

          <div className="grid gap-4">
            {recommendations.recommendations.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isFavorited={favorites[course.id]}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedCourse;
