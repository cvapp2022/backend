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
        }
        // {
        //     path: 'CVExp',
        //     populate: [
        //         {
        //             path: 'ExpSkill'
        //         }
        //     ]
        // },
        // {
        //     path: 'CVSkill'
        // },
        // {
        //     path: 'CVEdu',
        //     populate: [
        //         {
        //             path: 'EduSkill'
        //         }
        //     ]
        // },
        // {
        //     path: 'CVProj',
        //     populate: [{
        //         path: 'ProjSkill'
        //     }]
        // },
        // {
        //     path: 'CVReff'
        // },
        // {
        //     path: 'CVContact'
        // },
        // {
        //     path: 'CVOrg'
        // },
        // {
        //     path: 'CVAw',
        //     options: { sort: { 'AwSort': "ascending" } }
        // },
        // {
        //     path: 'CvMeta'
        // },
        // {
        //     path: 'CVImg'
        // },
        // {
        //     path:'CVTemplate',
        // },
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
                        populate:[{
                            path:'SessionMessage'
                        }]
                    },

                ]

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
                path: 'MeetSession',
                populate:[{
                    path:'SessionMessage'
                }]
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
