import CoverImage from "@/app/components/interface/coverImage";
import { Brewery } from "@/app/utils/def";

export default function BreweryCardDetailed({ brewery }: { brewery: Brewery }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-40 h-40 relative">
                    <CoverImage
                        cover_image={brewery.cover_image}
                        name={brewery.name}
                    />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {brewery.name}
                    </h1>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-gray-500">Location</span>
                            <p className="font-semibold text-gray-800">{brewery.location}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-gray-500">Founded</span>
                            <p className="font-semibold text-gray-800">
                                {brewery.date_of_founding}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}