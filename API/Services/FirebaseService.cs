using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;


namespace API.Services
{
    public class FirebaseService
    {
        private static FirebaseApp _firebaseApp;

        public FirebaseService()
        {
            _firebaseApp = FirebaseApp.DefaultInstance;
        }
        public async Task SendNotificationAsync(List<string> tokens, string title, string body)
        {

            var messages = tokens.Select(token => new Message()
            {
                Token = token,
                Notification = new Notification()
                {
                    Title = title,
                    Body = body
                }

            }).ToList();

            var messaging = FirebaseMessaging.GetMessaging(_firebaseApp);
            foreach (var message in messages)
            {
                try
                {
                    var response = await messaging.SendAsync(message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("\nNeusješno slanje poruke na token" + message.Token + ": " + ex.Message);
                }
            }
        }
    }
}

