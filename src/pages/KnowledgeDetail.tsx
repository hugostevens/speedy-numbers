
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLevelDisplayName } from '@/lib/math';
import { Video, Headphones, Eye, ExternalLink } from 'lucide-react';

const KnowledgeDetail: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");
  
  // Generate topic-specific learning materials based on the topicId
  const learningMaterials = useMemo(() => {
    const topic = topicId || "";
    const topicName = getLevelDisplayName(topic);
    const isAddition = topic.includes('addition');
    const isSubtraction = topic.includes('subtraction');
    const isMultiplication = topic.includes('multiplication');
    const isDivision = topic.includes('division');
    const isBasics = topic.includes('0-4') || topic.includes('1-4');
    
    let topicDescription = '';
    if (isAddition) {
      topicDescription = isBasics ? 'basic addition' : 'advanced addition';
    } else if (isSubtraction) {
      topicDescription = isBasics ? 'basic subtraction' : 'advanced subtraction';
    } else if (isMultiplication) {
      topicDescription = isBasics ? 'basic multiplication' : 'advanced multiplication';
    } else if (isDivision) {
      topicDescription = isBasics ? 'basic division' : 'advanced division';
    }
    
    return {
      videos: [
        { id: 1, title: `Understanding ${topicName}`, duration: "5:23", thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&w=400" },
        { id: 2, title: `Visual ${topicDescription} Strategies`, duration: "4:17", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&w=400" },
        { id: 3, title: `Step-by-Step ${topicDescription} Examples`, duration: "7:45", thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&w=400" },
      ],
      audios: [
        { id: 1, title: `${topicName} Song`, duration: "3:10" },
        { id: 2, title: `${topicDescription.charAt(0).toUpperCase() + topicDescription.slice(1)} Rhymes`, duration: "2:45" },
        { id: 3, title: `${topicName} Facts Podcast`, duration: "10:22" },
      ],
      visuals: [
        { id: 1, title: `${topicName} Number Line`, type: "Interactive" },
        { id: 2, title: `${topicDescription.charAt(0).toUpperCase() + topicDescription.slice(1)} with Visual Models`, type: "Diagram" },
        { id: 3, title: `${topicName} Fact Family Triangles`, type: "Interactive" },
      ]
    };
  }, [topicId]);
  
  return (
    <div className="page-container">
      <PageHeader 
        title={getLevelDisplayName(topicId || "")} 
        showBackButton 
        backPath="/knowledge" 
      />
      
      <p className="text-muted-foreground mb-6">
        Explore different ways to learn about {getLevelDisplayName(topicId || "")} 
        through videos, audio clips, and interactive visualizations.
      </p>
      
      <Tabs defaultValue="videos" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video size={16} />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="audios" className="flex items-center gap-2">
            <Headphones size={16} />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="visuals" className="flex items-center gap-2">
            <Eye size={16} />
            <span className="hidden sm:inline">Visualizations</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="space-y-4">
          {learningMaterials.videos.map(video => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-40 object-cover" 
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button variant="secondary" className="gap-2">
                    <Video size={16} />
                    Play Video
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                  {video.duration}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink size={16} />
                  Visit Source
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="audios" className="space-y-4">
          {learningMaterials.audios.map(audio => (
            <Card key={audio.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{audio.title}</CardTitle>
                  <span className="text-xs text-muted-foreground">{audio.duration}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-2 bg-secondary rounded-full w-full mx-2">
                    <div className="h-2 bg-primary rounded-full w-1/3"></div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 mr-2">
                    <Headphones size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="visuals" className="space-y-4">
          {learningMaterials.visuals.map(visual => (
            <Card key={visual.id}>
              <CardHeader>
                <CardTitle className="text-base">{visual.title}</CardTitle>
                <CardDescription>{visual.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-dashed border-muted-foreground rounded-md p-8 flex flex-col items-center justify-center text-center mb-4">
                  <Eye size={24} className="mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Interactive visualization will appear here
                  </p>
                </div>
                <Button variant="default" className="w-full">Try It Out</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeDetail;
