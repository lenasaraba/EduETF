// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;
// using System.IO;
// using System.Threading.Tasks;

// [Route("api/files")]
// [ApiController]
// public class FileController : ControllerBase
// {
//     private readonly GraphService _graphService;

//     public FileController(GraphService graphService)
//     {
//         _graphService = graphService;
//     }

//     [HttpPost("upload")]
//     public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
//     {
//         if (file == null || file.Length == 0)
//         {
//             return BadRequest("No file uploaded.");
//         }

//         using (var stream = new MemoryStream())
//         {
//             await file.CopyToAsync(stream);
//             stream.Position = 0; // Reset stream position

//             var result = await _graphService.UploadFileAsync(stream, file.FileName);
//             return Ok(new { Message = "File uploaded successfully!", FileId = result });
//         }
//     }
// }
