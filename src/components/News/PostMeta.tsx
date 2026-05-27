import type { PostAuthor } from "@/types/post";

const fallbackAuthorImage = "/teamLogo/logo_noBG.png";

type PostMetaProps = {
  author: PostAuthor;
  publishDate: string;
};

export default function PostMeta({ author, publishDate }: PostMetaProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-x-10 gap-y-4 sm:gap-x-12">
      <div className="border-body-color/10 flex items-center border-r pr-8 sm:pr-10 dark:border-white/10">
        <div className="mr-4">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <img
              src={author.image || fallbackAuthorImage}
              alt={author.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="w-full">
          <h4 className="text-dark mb-1 text-sm font-medium dark:text-white">{author.name}</h4>
          <p className="text-body-color text-xs dark:text-body-color-dark">
            {author.designation}
          </p>
        </div>
      </div>

      <div className="inline-block">
        <h4 className="text-dark mb-1 text-sm font-medium dark:text-white">Дата</h4>
        <p className="text-body-color text-xs dark:text-body-color-dark">{publishDate}</p>
      </div>
    </div>
  );
}
