"use client";

interface IssueCardSmallProps {
    id: number;
    title: string;
    description: string;
    status: string;
}

const IssueCardSmall = (
    {
        id,
        title,
        description,
        status,
    }: IssueCardSmallProps) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'green';
            case 'closed':
                return 'red';
            default:
                return 'gray';
        }
    };

    const visibilityLocale = {
        public: 'viešas',
        private: 'privatus'
    };

    return (
        <div className="rounded-xl border-2 border-gray-100 bg-white w-full mb-3">
            <article>
                <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:px-6 lg:px-8">
                    <div className="flex-grow">
                        <div className="flex items-center">
                            <span
                                className="hidden sm:block h-4 w-4 rounded-full mr-2"
                                style={{ backgroundColor: getStatusColor(status) }}
                                aria-hidden="true"
                            ></span>
                            <h3 className="font-medium sm:text-lg"> {title} </h3>
                        </div>
                        <p className="line-clamp-2 text-sm text-gray-700"> {description} </p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default IssueCardSmall;