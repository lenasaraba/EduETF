namespace API.RequestHelpers
{
    public class CourseParams:PaginationParams{
    public string Type { get; set; }="all";
    
    public string SearchTerm { get; set; }=string.Empty;
    public List<string> StudyPrograms { get; set; } = new();
    public List<string> Years { get; set; } = new();
    }
}