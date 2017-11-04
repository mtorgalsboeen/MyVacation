let Users = [{
        'userToken': '12343fds',
        'vacations': [
            {
                'vacationId': 'dsf32442',
                'vacationTitle': "VACATION TITLE",
                'locations': [
                    { 'locationId': 'sdnfhsbfhjshj' },
                    { 'locationId': 'sdnfhs454353j' },
                    { 'locationId': 'sdnfhsbfhjsdfsdfsf' }
                ],
                'ToDoLists': [
                    {
                        'toDoListId': 'dsfnjsfk2434',
                        'toDoListTitle': "The To DO LIST",
                        'Tasks': [
                            {
                                'taskId': '1001432',
                                'taskTitle': "The Other",
                                'completed': 1
                            },
                            {
                                'taskId': '10019232',
                                'taskTitle': "The Task",
                                'completed': 1
                            }
                        ]
                    },
                    {
                        'toDoListId': 'dsfnjsfk2434',
                        'toDoListTitle': "The To DO LIST",
                        'Tasks': [
                            {
                                'taskId': '1001432',
                                'taskTitle': "The Other",
                                'completed': 1
                            },
                            {
                                'taskId': '10019232',
                                'taskTitle': "The Task",
                                'completed': 1
                            }
                        ]
                    }
                ]
            }]
        
    }];

console.log(JSON.stringify(Users[0]["vacations"]));