exports.UserPopulate = [{
    path: 'CVUCvId',
    populate: [
        {
            path: 'CVExp',
            options: { sort: { 'ExpSort': "ascending" } },
            populate: [
                {
                    path: 'ExpSkill'
                }
            ]
        },
        {
            path: 'CVSkill'
        },
        {
            path: 'CVEdu',
            options: { sort: { 'EduSort': "ascending" } },
            populate: [
                {
                    path: 'EduSkill'
                }
            ]
        },
        {
            path: 'CVProj',
            populate: [{
                path: 'ProjSkill'
            }],
            options: { sort: { 'ProjSort': "ascending" } },
        },
        {
            path: 'CVReff',
            options: { sort: { 'RefSort': "ascending" } },
        },
        {
            path: 'CVContact'
        },
        {
            path: 'CVOrg',
            options: { sort: { 'OrgSort': "ascending" } },
        },
        {
            path: 'CVAw',
            options: { sort: { 'AwSort': "ascending" } }
        },
        {
            path:'CVTemplate',
        },
        {
            path: 'CVImg'
        },
        {
            path:'CVPosition'
        }
    ]
},
{
    path: 'CVUClId'
},
{
    path: 'MNRequests',
    populate:
        [
            {
                path: 'ReqProg',

                //model:'MnRequest'
            },
            {
                path: 'ReqMeets',
                populate: [
                    {
                        path: 'MeetSession',
                        populate:[
                            {
                                path:'SessionMessage'
                            },
                            {
                                path:'SessionAttachments'
                            }
                        ]
                    },
                    {
                        path:'MeetPrepare'
                    }

                ]

            }
        ]
},
{
    path:'UserNotif',
    options:{
        limit:6,
        sort: { 'createdAt': "descending" }
    } 
}
];


exports.RequestPopulation = [

    {
        path: 'ReqMentor'
    },
    {
        path: 'ReqProg'
    },
    {
        path: 'ReqMeets',
        populate:
        [
            {
                path: 'MeetSession',
                populate:[
                    {
                        path:'SessionMessage',
                    },
                    {
                        path:'SessionAttachments'
                    }
                ]
            },
            {
                path:'MeetPrepare'
            }
        ]
    }
];

exports.ProgramPopulation = [
    {
        path: 'ProgMentors'
    },
    {
        path:'ProgPreparation'
    },
    {
        path:'ProgChilds'
    }
]

exports.MentorPopulation = [
    {
        path: 'MentorRequests'
    },
    {
        path:'MentorNotif',
        options:{limit:6}
    }
]

exports.CvPopulate = [

    {
        path: 'CVExp',
        options: { sort: { 'ExpSort': "ascending" } },
        populate: [
            {
                path: 'ExpSkill'
            }
        ]
    },
    {
        path: 'CVSkill'
    },
    {
        path: 'CVEdu',
        options: { sort: { 'EduSort': "ascending" } },
        populate: [
            {
                path: 'EduSkill'
            }
        ]
    },
    {
        path: 'CVProj',
        populate: [{
            path: 'ProjSkill'
        }],
        options: { sort: { 'ProjSort': "ascending" } },
    },
    {
        path: 'CVReff',
        options: { sort: { 'RefSort': "ascending" } },
    },
    {
        path: 'CVContact'
    },
    {
        path: 'CVOrg',
        options: { sort: { 'OrgSort': "ascending" } },
    },
    {
        path: 'CVAw',
        options: { sort: { 'AwSort': "ascending" } }
    },
    {
        path:'CVTemplate',
    },
    {
        path: 'CVImg'
    },
    {
        path:'CVPosition'
    }

]

exports.PostPopulate =[
    {
        path:'PostCategory'
    },
    {
        path:'PostChild',
    }
]
