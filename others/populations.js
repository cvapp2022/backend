exports.UserPopulate = [{
    path: 'CVUCvId',
    populate: [
        {
            path: 'CVExp',
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
            }]
        },
        {
            path: 'CVReff'
        },
        {
            path: 'CVContact'
        },
        {
            path: 'CVOrg'
        },
        {
            path: 'CVAw',
            options: { sort: { 'AwSort': "ascending" } }
        },
        {
            path: 'CvMeta'
        },
        {
            path: 'CVImg'
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
                populate:[{
                    path: 'MeetSession'
                }]

            }
        ]
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
            [{
                path: 'MeetSession'
            }]
    }
];

exports.ProgramPopulation = [
    {
        path: 'ProgMentors'
    },
    // {
    //     path:'ProgMeets'
    // }
]

exports.MentorPopulation = [
    {
        path: 'MentorRequests'
    }
]