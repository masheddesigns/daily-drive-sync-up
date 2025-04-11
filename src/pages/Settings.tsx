import React, { useState } from 'react';
import { 
  Save,
  Upload,
  Download,
  AlertCircle,
  Loader2,
  Link,
  Link2Off,
  CheckCircle2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useData } from '@/context/DataContext';
import { format } from 'date-fns';

const Settings = () => {
  const { 
    exportData, 
    importData, 
    isDriveConnected, 
    connectToDrive, 
    disconnectFromDrive, 
    backupToGoogleDrive, 
    restoreFromGoogleDrive,
    isLoading
  } = useData();
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `daily-drive-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = () => {
    if (!importFile) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!data.habits || !data.todos || !data.notes) {
          throw new Error('Invalid data format');
        }
        
        importData(data);
        setImportError(null);
        setImportSuccess(true);
        setImportFile(null);
        
        setTimeout(() => {
          setImportSuccess(false);
        }, 3000);
        
      } catch (error) {
        console.error('Import error:', error);
        setImportError('Failed to import data. Please make sure the file is valid.');
        setImportSuccess(false);
      }
    };
    
    reader.readAsText(importFile);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your data and backup settings
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Local Backup & Restore</CardTitle>
            <CardDescription>
              Export your data to a file or import from a previous backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button onClick={handleExport} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will download a JSON file with all your habits, todos, and notes.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="importFile">Import Data</Label>
              <div className="flex gap-2">
                <Input
                  id="importFile"
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImportFile(file);
                    setImportError(null);
                    setImportSuccess(false);
                  }}
                />
                <Button 
                  onClick={handleImport} 
                  disabled={!importFile || isLoading}
                  className="whitespace-nowrap"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
              
              {importError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{importError}</AlertDescription>
                </Alert>
              )}
              
              {importSuccess && (
                <Alert className="mt-2 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-600">Success</AlertTitle>
                  <AlertDescription>Data imported successfully</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Google Drive Integration</CardTitle>
            <CardDescription>
              Connect to Google Drive to automatically backup and sync your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Google Drive Connection</Label>
                <p className="text-sm text-muted-foreground">
                  {isDriveConnected 
                    ? "Your account is connected to Google Drive" 
                    : "Connect to enable automatic backups"
                  }
                </p>
              </div>
              <Button 
                variant={isDriveConnected ? "outline" : "default"}
                onClick={isDriveConnected ? disconnectFromDrive : connectToDrive}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : isDriveConnected ? (
                  <Link2Off className="h-4 w-4 mr-2" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                {isDriveConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
            
            {isDriveConnected && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={backupToGoogleDrive}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Backup Now
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={restoreFromGoogleDrive}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Restore
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
