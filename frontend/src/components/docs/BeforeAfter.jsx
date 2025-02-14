import React from 'react';
import {Card, CardContent} from "../ui/card";
import {DocsImage} from "./Image";

const BeforeAfter = ({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
}) => {
  return (
      <div className="flex mt-6 gap-2">
        <div>
          <Card>
            <CardContent className="p-2">
              <DocsImage src={beforeSrc} alt={beforeAlt}/>
            </CardContent>
          </Card>
          <div className="flex justify-center mt-2">
            <span className="text-lg font-bold text-rose-500">Before</span>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-2">
              <DocsImage src={afterSrc} alt={afterAlt}/>
            </CardContent>
          </Card>
          <div className="flex justify-center mt-3">
            <span className="text-lg font-bold text-blue-500">After</span>
          </div>
        </div>
      </div>
  );
};

export default BeforeAfter;