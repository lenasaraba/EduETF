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
            CreateMap<GetThemeCourseDto, Course>();

            CreateMap<CourseMaterial, GetCourseMaterialDto>();
            CreateMap<CreateCourseMaterialDto, CourseMaterial>();


            CreateMap<CreateThemeDto, Theme>();
            CreateMap<Theme, GetThemeDto>();
            CreateMap<GetThemeDto, Theme>();

            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

            CreateMap<UserCourse, UserCourseDto>();
            CreateMap<UserCourseDto, UserCourse>();

            CreateMap<ProfessorCourse, ProfessorCourseDto>();
            CreateMap<ProfessorCourseDto, ProfessorCourse>();

            CreateMap<CreateMessageDto, Message>();
            CreateMap<Message, GetMessageDto>();
            CreateMap<GetMessageDto, Message>();
            CreateMap<CreateMessageMaterialDto, MessageMaterial>();
            CreateMap<MessageMaterial, GetMessageMaterialDto>();



            CreateMap<Course, CreateCourseDto>();
            CreateMap<CreateCourseDto, Course>();

        }
    }
}