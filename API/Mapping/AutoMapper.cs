using API.DTOs;
using API.Entities;

namespace API.Mapping
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<Course, CourseDto>();
            CreateMap<Course, GetThemeCourseDto>();
            CreateMap<CourseMaterial, GetCourseMaterialDto>();
            CreateMap<CreateCourseMaterialDto, CourseMaterial>();


            CreateMap<CreateThemeDto, Theme>();
            CreateMap<Theme, GetThemeDto>();
            CreateMap<User, UserDto>();
            CreateMap<UserCourse, UserCourseDto>();
            CreateMap<ProfessorCourse, ProfessorCourseDto>();
            CreateMap<ProfessorCourseDto, ProfessorCourse>();

            CreateMap<CreateMessageDto, Message>();
            CreateMap<Message, GetMessageDto>();

            CreateMap<Course, CreateCourseDto>();
            CreateMap<CreateCourseDto, Course>();

        }
    }
}