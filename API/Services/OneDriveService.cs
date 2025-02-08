// using Azure.Identity;
// using Microsoft.Graph;
// using System;
// using System.IO;
// using System.Threading.Tasks;

// public class GraphService
// {
//     private readonly GraphServiceClient _graphClient;
//     // private readonly string _userId; // ID korisnika čiji OneDrive koristimo

//     public GraphService(string tenantId, string clientId, string clientSecret, string userId)
//     {
        
//         var clientSecretCredential = new ClientSecretCredential(tenantId, clientId, clientSecret);
//         _graphClient = new GraphServiceClient(clientSecretCredential);
//         // _userId = userId;
//     }

//     /// <summary>
//     /// Otpremi fajl na OneDrive određenog korisnika
//     /// </summary>
//    public async Task<string> UploadFileAsync(Stream fileStream, string fileName)
// {
//     try
//     {
//         var user = await _graphClient.Me.GetAsync();
//         // _userId=user.Id;
//         // Proveravamo Drive ID (ako Root ne radi)
//         var drive = await _graphClient.Users[user?.Id].Drive.GetAsync();
//         string driveId = drive?.Id ?? throw new Exception("Drive ID not found");

//         // Upload fajla
//         var uploadedFile = await _graphClient.Drives[driveId]
//             .Root
//             .ItemWithPath(fileName)
//             .Content
//             .PutAsync(fileStream);

//         return uploadedFile?.Id ?? "Upload failed";
//     }
//     catch (Exception ex)
//     {
//         return $"Error: {ex.Message}";
//     }
// }

// }
